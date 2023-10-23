import LiveEditor from "./cell_editor/live_editor";
import {
  getAttributeOrDefault,
  getAttributeOrThrow,
} from "../lib/attribute";

import monaco from "./cell_editor/live_editor/monaco";

const InlineAIComponent = {
  mounted() {

    // // TODO is the convention for these vars to have an underscore or no?
    // this._cellId = cellId;
    // this._hook = hook;
    // this._editor = this.findEditor();

    // // TODO resize textarea if it contains more than one row
    // const widgetNode = this.renderWidget();
    // const selection = this.makeSelection();

    // const position = new monaco.Position(selection.startLineNumber-1, 1);

    // this._overlayWidget = {
    //   getId: () => `livebook.ai_helper.overlay.${this.cellId}`,
    //   getDomNode: () => widgetNode,
    //   getPosition: () => {
    //     return {
    //         position: position,
    //         preference: [monaco.editor.ContentWidgetPositionPreference.ABOVE]
    //     };
    //   },
    // };

    // this._editor.addOverlayWidget(this._overlayWidget);

    // this.setViewZone();
    // this.focusTextarea();
    // this.addEventListeners();

    this._cellId = getAttributeOrThrow(this.el, "data-cell-id");
    this._editor = this.findEditor(this._cellId);


    const widgetNode = this.el;
    const selection = this.makeSelection();

    const position = new monaco.Position(selection.startLineNumber-1, 1);

    this._overlayWidget = {
      getId: () => `livebook.ai_helper.overlay.${this._cellId}`,
      getDomNode: () => widgetNode,
      getPosition: () => {
        return {
            position: position,
            preference: [monaco.editor.ContentWidgetPositionPreference.ABOVE]
        };
      },
    };

    this._editor.addOverlayWidget(this._overlayWidget);

    this.setViewZone();
    this.focusTextarea();
    // this.addEventListeners();



    // const formElement = this.el.querySelector('form');
    // formElement.addEventListener("submit", (event) => {
    //   event.preventDefault();      

    //   const prompt = formElement.querySelector('input').value;

    //   // TODO it probably makes more sense to get the cell content on the server side, as 
    //   // we also want content from all other cells in the livebook
    //   this.pushEventTo(this.el, "request_inline_ai_completion",
    //   {selectedCode: selectedText, cellContent: editor.getModel().getValue(), prompt: prompt })
    // });

    // Add the content widget to the editor
    // this._editor.addOverlayWidget(contentWidget);

    
    var aiResponse = ""
    this.handleEvent(
      `inline_ai_token_received:${this._cellId}`,
      ({chunk}) => {

        // first chunk
        // if(aiResponse == "") {
        //   this._editor.trigger(monaco.KeyCode.Backspace, 'deleteLeft')
        // }

        aiResponse += chunk
        console.log(aiResponse)
        // this._editor.trigger('keyboard', 'type', {text: chunk});
        this._editor.executeEdits('my-source', [{
          identifier: { major: 1, minor: 1 },
          range: editor.getSelection(),
          text: chunk,
          forceMoveMarkers: true
        }]);                
      }
    );
  },

  disconnected() {
    // When disconnected, this client is no longer seen by the server
    // and misses all collaborative changes. On reconnection we want
    // to clean up and mount a fresh hook, which we force by ensuring
    // the DOM id doesn't match
    // this.el.removeAttribute("id");
  },

  destroyed() {
    // if (this.liveEditor) {
    //   this.el.dispatchEvent(
    //     new CustomEvent("lb:cell:editor_removed", {
    //       detail: { tag: this.props.tag },
    //       bubbles: true,
    //     })
    //   );
    //   this.liveEditor.dispose();
    // }
  },

  setViewZone() {

    const position = this._overlayWidget.getPosition().position;
    const widgetNode = this._overlayWidget.getDomNode();

    this._editor.changeViewZones((changeAccessor) => {
        this._viewZone = changeAccessor.addZone({
          afterLineNumber: position.lineNumber,
          // Placeholder for all lines and additional padding
          heightInPx: widgetNode.offsetHeight,
          domNode: document.createElement("div"),
          onDomNodeTop: (top) => {
            widgetNode.style.top = `${top}px`;

            const marginWidth = this._editor
              .getDomNode()
              .querySelector(".margin-view-overlays").offsetWidth;

            widgetNode.style.paddingLeft = `calc(${marginWidth}px + ${0}ch)`;
          },
          // onComputedHeight: (height) => {
          //   widgetNode.style.height = `${height}px`;
          // },
        });
      });
  },

  focusTextarea() { this._overlayWidget.getDomNode().querySelector("textarea").focus(); },

  // modifies current selection to be complete lines and inserts an
  // empty line if there is no selection
  makeSelection() {
    let selection = this._editor.getSelection();

    // If no code is selected we insert a new empty row below the current one
    // and show the widget above that
    if(selection.isEmpty()) {

        if(selection.startLineNumber == 1 ){
            return selection;
        }

        // TODO what is 'my-source' in this context?...
        // TODO if we cancel out of the ai overlay, we need to remove the line we inserted
      this._editor.executeEdits('my-source', [{
            identifier: { major: 1, minor: 1 },
            range: new monaco.Range(selection.startLineNumber, Infinity, selection.startLineNumber, Infinity),
            text: "\n",
            forceMoveMarkers: true
          }]);

        selection = new monaco.Selection(selection.startLineNumber+1, 1, selection.startLineNumber+1, 1)

    } else {
        selection = selection.setStartPosition(selection.startLineNumber, 1);
        selection = selection.setEndPosition(selection.endLineNumber+1, 1);
    }
    this._editor.setSelection(selection);
    return selection;
  },

  findEditor(cellId) {
    return monaco.editor.getEditors().find(editor => 
      document.getElementById("cell-" + cellId).contains(editor.getDomNode())
    );
  },

  getProps() {
    return {
      cellId: getAttributeOrThrow(this.el, "data-cell-id"),
      // TODO understand how tags work - something to do with events?
      // tag: getAttributeOrThrow(this.el, "data-tag"),
    };
  },
};

export default InlineAIComponent;
