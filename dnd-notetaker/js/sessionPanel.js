// Session Detail Panel - OneNote-style side drawer for viewing/editing a
// session, opened by double-clicking a session card (see js/sessions.js).
// Supports multiple tabs in one pane, and dragging a tab out to split into
// up to 3 side-by-side panes. See aidlc-docs/construction/session-detail-panel/
// for the full design (business rules BR1-BR20, flows, etc.).
//
// panes[0] is always the "main" pane (the one double-clicking a session adds
// tabs to). Every other pane is a single-tab pane created by dragging a tab
// out (detachToSplit) - drag-to-split never adds a second tab to a pane that
// already came from a split, only the main pane grows via open().
const SessionPanel = {
    panes: [],
    MAX_PANES: 3,
    SAVE_DEBOUNCE_MS: 1500,

    _drafts: {},       // sessionId -> in-progress edited session object
    _saveTimers: {},   // sessionId -> setTimeout id
    _paneCounter: 0,
    _dragState: null,  // { sessionId, originPaneId } while a tab drag is in progress

    // ---- URL state (BR19, BR20) ----

    initFromURL(){
        const params = new URLSearchParams(window.location.search);
        const openIds = (params.get("open") || "").split(",").filter(Boolean)
            .filter(id => loadItem(id));
        const splitIds = (params.get("split") || "").split(",").filter(Boolean)
            .filter(id => openIds.includes(id));

        this.panes = [];

        const mainTabs = openIds.filter(id => !splitIds.includes(id));
        if (mainTabs.length > 0){
            this.panes.push(this._newPane(mainTabs, mainTabs[mainTabs.length - 1]));
        }
        splitIds.forEach(id => {
            if (this.panes.length < this.MAX_PANES){
                this.panes.push(this._newPane([id], id));
            }
        });

        this.render();
    },

    _syncURL(){
        const params = new URLSearchParams(window.location.search);
        const openIds = this.panes.flatMap(pane => pane.tabs);
        const splitIds = this.panes.slice(1).map(pane => pane.tabs[0]);

        if (openIds.length > 0){
            params.set("open", openIds.join(","));
        } else {
            params.delete("open");
        }
        if (splitIds.length > 0){
            params.set("split", splitIds.join(","));
        } else {
            params.delete("split");
        }

        const newUrl = window.location.pathname + "?" + params.toString();
        history.replaceState(null, "", newUrl);
    },

    _newPane(tabs, activeTabSessionId){
        this._paneCounter++;
        return { paneId: "pane_" + this._paneCounter, tabs, activeTabSessionId, widthPx: null };
    },

    // ---- Opening / switching / closing tabs (BR1-BR4) ----

    open(sessionId){
        const existingPane = this.panes.find(pane => pane.tabs.includes(sessionId));
        if (existingPane){
            existingPane.activeTabSessionId = sessionId;
            this.render();
            this._syncURL();
            return;
        }

        let mainPane = this.panes[0];
        if (!mainPane){
            if (this.panes.length >= this.MAX_PANES) return; // at cap, nowhere to open it
            mainPane = this._newPane([], null);
            this.panes.unshift(mainPane);
        }
        mainPane.tabs.push(sessionId);
        mainPane.activeTabSessionId = sessionId;

        this.render();
        this._syncURL();
    },

    switchTab(sessionId){
        const pane = this.panes.find(p => p.tabs.includes(sessionId));
        if (!pane) return;
        pane.activeTabSessionId = sessionId;
        this.render();
    },

    closeTab(sessionId){
        const paneIndex = this.panes.findIndex(pane => pane.tabs.includes(sessionId));
        if (paneIndex === -1) return; // not open - nothing to do (safe to call unconditionally)

        this._flushSave(sessionId);
        this._clearDraft(sessionId);

        const pane = this.panes[paneIndex];
        const tabIndex = pane.tabs.indexOf(sessionId);
        pane.tabs.splice(tabIndex, 1);

        if (pane.tabs.length === 0){
            this.panes.splice(paneIndex, 1); // BR3/BR8: empty pane disappears, others reflow
        } else if (pane.activeTabSessionId === sessionId){
            pane.activeTabSessionId = pane.tabs[Math.max(0, tabIndex - 1)]; // BR2
        }

        this.render();
        this._syncURL();
    },

    // ---- Split view (BR5-BR8) ----

    detachToSplit(sessionId, dropIndex){
        const originIndex = this.panes.findIndex(pane => pane.tabs.includes(sessionId));
        if (originIndex === -1) return;

        const originPane = this.panes[originIndex];
        const willEmptyOrigin = originPane.tabs.length === 1;
        const paneCountAfterRemoval = this.panes.length - (willEmptyOrigin ? 1 : 0);
        if (paneCountAfterRemoval >= this.MAX_PANES) return; // BR5: at cap, no-op/snap-back

        const tabIndex = originPane.tabs.indexOf(sessionId);
        originPane.tabs.splice(tabIndex, 1);
        if (originPane.tabs.length === 0){
            this.panes.splice(originIndex, 1);
            if (dropIndex > originIndex) dropIndex--; // account for the shifted array
        } else if (originPane.activeTabSessionId === sessionId){
            originPane.activeTabSessionId = originPane.tabs[Math.max(0, tabIndex - 1)];
        }

        const newPane = this._newPane([sessionId], sessionId);
        this.panes.splice(Math.min(dropIndex, this.panes.length), 0, newPane);

        this.render();
        this._syncURL();
    },

    mergeSplit(sessionId, targetPaneId){
        const originIndex = this.panes.findIndex(pane => pane.tabs.includes(sessionId));
        if (originIndex === -1) return;
        const originPane = this.panes[originIndex];
        if (originPane.paneId === targetPaneId) return; // BR7: dropping into its own pane is a no-op

        this.panes.splice(originIndex, 1);

        const targetPane = this.panes.find(p => p.paneId === targetPaneId) || this.panes[0];
        if (!targetPane) return; // was the only pane - nothing to merge into

        targetPane.tabs.push(sessionId);
        targetPane.activeTabSessionId = sessionId;

        this.render();
        this._syncURL();
    },

    // ---- Resize (in-memory only, not URL-persisted) ----

    resize(paneId, widthPx){
        const pane = this.panes.find(p => p.paneId === paneId);
        if (!pane) return;
        const clamped = Math.max(240, Math.min(widthPx, window.innerWidth * 0.9));
        pane.widthPx = clamped;

        const paneEl = document.querySelector(`.panel-pane[data-pane-id="${paneId}"]`);
        if (paneEl) paneEl.style.width = clamped + "px";
    },

    // ---- Field editing & autosave (BR9-BR14) ----
    // Deliberately does NOT call render() - the pane the user is typing in is
    // already showing what they typed; rebuilding the DOM here would blow
    // away their cursor position mid-keystroke.

    handleFieldChange(sessionId, field, value){
        const current = this._drafts[sessionId] || loadItem(sessionId) || { id: sessionId };
        this._drafts[sessionId] = { ...current, [field]: value };

        if (this._saveTimers[sessionId]) clearTimeout(this._saveTimers[sessionId]);
        this._saveTimers[sessionId] = setTimeout(() => {
            this._flushSave(sessionId);
        }, this.SAVE_DEBOUNCE_MS);
    },

    _flushSave(sessionId){
        if (this._saveTimers[sessionId]){
            clearTimeout(this._saveTimers[sessionId]);
            delete this._saveTimers[sessionId];
        }

        const draft = this._drafts[sessionId];
        if (!draft) return;
        if (!loadItem(sessionId)) return; // BR14: session was deleted, don't recreate it

        const toSave = { ...draft };
        toSave.title = (toSave.title || "").trim() || "Untitled Session"; // BR12
        if (typeof toSave.tags === "string"){
            toSave.tags = toSave.tags.split(",").map(s => s.trim()).filter(Boolean); // BR13
        }

        saveItem(sessionId, toSave);
        renderSessions(); // list card reflects the edit; panel DOM is untouched
        this._updateTabLabel(sessionId, toSave.title); // keep the tab bar's title in sync without a full render()
    },

    _updateTabLabel(sessionId, title){
        const tabEl = document.querySelector(`.pane-tab[data-session-id="${sessionId}"] span:first-child`);
        if (tabEl) tabEl.textContent = title;
    },

    _clearDraft(sessionId){
        delete this._drafts[sessionId];
        if (this._saveTimers[sessionId]){
            clearTimeout(this._saveTimers[sessionId]);
            delete this._saveTimers[sessionId];
        }
    },

    _flushAll(){
        Object.keys(this._saveTimers).forEach(sessionId => this._flushSave(sessionId));
    },

    // ---- Rendering ----

    render(){
        const container = document.getElementById("session-panel-container");
        if (!container) return;

        if (this.panes.length === 0){
            container.innerHTML = "";
            return;
        }

        // Drop zones stay in the DOM whenever there's room for another pane
        // (BR5) - they're just visually thin until a drag highlights them
        // (see .drop-zone-active in CSS). Deliberately NOT gated on
        // _dragState: re-rendering mid-drag would remove the tab element
        // that's actively being dragged and cancel the browser's drag
        // operation, so dragstart/dragend never call render().
        const dropZonesEnabled = this.panes.length < this.MAX_PANES;
        let html = "";
        if (dropZonesEnabled) html += this._buildDropZoneHTML(0);

        this.panes.forEach((pane, index) => {
            html += this._buildPaneHTML(pane);
            if (dropZonesEnabled) html += this._buildDropZoneHTML(index + 1);
        });

        container.innerHTML = html;
        this._attachPaneListeners(container);
    },

    _buildDropZoneHTML(dropIndex){
        return `<div class="pane-drop-zone" data-drop-index="${dropIndex}" data-testid="session-panel-drop-zone"></div>`;
    },

    _buildPaneHTML(pane){
        const widthStyle = pane.widthPx ? ` style="width:${pane.widthPx}px;"` : "";
        const tabsHTML = pane.tabs.map(sessionId => {
            const session = this._getSessionData(sessionId);
            const isActive = sessionId === pane.activeTabSessionId;
            return `
                <div class="pane-tab${isActive ? " active-tab" : ""}" draggable="true"
                     data-session-id="${sessionId}" data-pane-id="${pane.paneId}"
                     data-testid="session-panel-tab">
                    <span>${escapeHtml(session ? session.title : "Untitled Session")}</span>
                    <span class="pane-tab-close" data-testid="session-panel-tab-close">&times;</span>
                </div>`;
        }).join("");

        const activeSession = this._getSessionData(pane.activeTabSessionId) || {};
        const tagsValue = Array.isArray(activeSession.tags) ? activeSession.tags.join(", ") : (activeSession.tags || "");

        return `
        <div class="panel-pane" data-pane-id="${pane.paneId}"${widthStyle}>
            <div class="pane-resize-handle" data-pane-id="${pane.paneId}" data-testid="session-panel-resize-handle"></div>
            <div class="pane-tab-bar" data-pane-id="${pane.paneId}">${tabsHTML}</div>
            <div class="pane-content" data-session-id="${pane.activeTabSessionId}">
                <label>Title</label>
                <input type="text" class="panel-field" data-field="title" value="${escapeHtml(activeSession.title || "")}" data-testid="session-panel-title-input">
                <label>Date</label>
                <input type="date" class="panel-field" data-field="date" value="${escapeHtml(activeSession.date || "")}" data-testid="session-panel-date-input">
                <label>In-Game Date</label>
                <input type="text" class="panel-field" data-field="inGameDate" value="${escapeHtml(activeSession.inGameDate || "")}" data-testid="session-panel-ingamedate-input">
                <label>Tags (comma-separated)</label>
                <input type="text" class="panel-field" data-field="tags" value="${escapeHtml(tagsValue)}" data-testid="session-panel-tags-input">
                <label>Summary</label>
                <textarea class="panel-field panel-summary-input" data-field="summary" data-testid="session-panel-summary-input">${escapeHtml(activeSession.summary || "")}</textarea>
            </div>
        </div>`;
    },

    _getSessionData(sessionId){
        if (!sessionId) return null;
        return this._drafts[sessionId] || loadItem(sessionId);
    },

    // ---- Event wiring ----

    _attachPaneListeners(container){
        container.querySelectorAll(".pane-tab").forEach(tabEl => {
            const sessionId = tabEl.dataset.sessionId;
            const paneId = tabEl.dataset.paneId;

            tabEl.addEventListener("click", (event) => {
                if (event.target.closest(".pane-tab-close")) return;
                this.switchTab(sessionId);
            });

            tabEl.querySelector(".pane-tab-close").addEventListener("click", (event) => {
                event.stopPropagation();
                this.closeTab(sessionId);
            });

            tabEl.addEventListener("dragstart", () => {
                this._dragState = { sessionId, originPaneId: paneId };
            });

            tabEl.addEventListener("dragend", () => {
                this._dragState = null;
                container.querySelectorAll(".drop-zone-active").forEach(el => el.classList.remove("drop-zone-active"));
            });
        });

        container.querySelectorAll(".pane-drop-zone").forEach(zoneEl => {
            zoneEl.addEventListener("dragover", (event) => {
                event.preventDefault();
                zoneEl.classList.add("drop-zone-active");
            });
            zoneEl.addEventListener("dragleave", () => {
                zoneEl.classList.remove("drop-zone-active");
            });
            zoneEl.addEventListener("drop", (event) => {
                event.preventDefault();
                if (!this._dragState) return;
                const dropIndex = parseInt(zoneEl.dataset.dropIndex, 10);
                this.detachToSplit(this._dragState.sessionId, dropIndex);
                this._dragState = null;
            });
        });

        container.querySelectorAll(".pane-tab-bar").forEach(barEl => {
            const paneId = barEl.dataset.paneId;
            barEl.addEventListener("dragover", (event) => {
                if (this._dragState && this._dragState.originPaneId !== paneId) event.preventDefault();
            });
            barEl.addEventListener("drop", (event) => {
                if (!this._dragState || this._dragState.originPaneId === paneId) return;
                event.preventDefault();
                this.mergeSplit(this._dragState.sessionId, paneId);
                this._dragState = null;
            });
        });

        container.querySelectorAll(".pane-resize-handle").forEach(handleEl => {
            handleEl.addEventListener("mousedown", (event) => {
                event.preventDefault();
                const paneId = handleEl.dataset.paneId;
                const paneEl = handleEl.closest(".panel-pane");
                const startX = event.clientX;
                const startWidth = paneEl.getBoundingClientRect().width;

                const onMouseMove = (moveEvent) => {
                    const delta = startX - moveEvent.clientX; // dragging left = wider (panel is right-anchored)
                    this.resize(paneId, startWidth + delta);
                };
                const onMouseUp = () => {
                    document.removeEventListener("mousemove", onMouseMove);
                    document.removeEventListener("mouseup", onMouseUp);
                };
                document.addEventListener("mousemove", onMouseMove);
                document.addEventListener("mouseup", onMouseUp);
            });
        });

        container.querySelectorAll(".panel-field").forEach(fieldEl => {
            const sessionId = fieldEl.closest(".pane-content").dataset.sessionId;
            fieldEl.addEventListener("input", () => {
                this.handleFieldChange(sessionId, fieldEl.dataset.field, fieldEl.value);
            });
        });
    }
};

// BR11: flush pending autosaves on tab close (handled in closeTab/mergeSplit's
// origin removal path is a no-op here since sessions keep their drafts unless
// closed) and on navigating away entirely.
window.addEventListener("beforeunload", () => SessionPanel._flushAll());

window.addEventListener("load", function(){
    if (document.getElementById("session-panel-container")){
        SessionPanel.initFromURL();
    }
});
