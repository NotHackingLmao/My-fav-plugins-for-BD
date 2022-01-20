/**
 * @name AnimationStatus
 * @version 1.0.0
 * @description Animate Your Discord Status
 * @author nimaisox
 * @authorId 631463369458843668
 * @invite DStAkkypnm
 * @source https://github.com/nimaisox/Discord-AutoStatus
 */
 module.exports = class AnimationStatus{
   
    SetData(key, value) {
		BdApi.setData("AnimatedStatus", key, value);
	}

	GetData(key) {
		return BdApi.getData("AnimatedStatus", key);
	}

    /* Code related to Animations */
	load() {
		this.kSpacing = "15px";
		this.kMinTimeout = 2900;
		this.cancel = undefined;

		this.animation = this.GetData("animation") || [];
		this.timeout = this.GetData("timeout") || this.kMinTimeout;

		// Import Older Config Files
		if (typeof this.timeout == "string")
			this.timeout = parseInt(this.timeout);
		if (this.animation.length > 0 && Array.isArray(this.animation[0]))
			this.animation = this.animation.map(em => this.ConfigObjectFromArray(em));

		Status.authToken = BdApi.findModule(m => m.default && m.default.getToken).default.getToken();
		this.currentUser = BdApi.findModule(m => m.default && m.default.getCurrentUser).default.getCurrentUser();
	}

	start() {
		if (this.animation.length == 0)
			BdApi.showToast("Animated Status: No status set. Go to Settings>Plugins to set a custom animation!");
		else
			this.AnimationLoop();
	}

	stop() {
		if (this.cancel) {
			this.cancel();
		} else {
			console.assert(this.loop != undefined);
			clearTimeout(this.loop);
		}
		Status.Set(null);
	}

	ConfigObjectFromArray(arr) {
		let data = {};
		if (arr[0] !== undefined && arr[0].length > 0) data.text       = arr[0];
		if (arr[1] !== undefined && arr[1].length > 0) data.emoji_name = arr[1];
		if (arr[2] !== undefined && arr[2].length > 0) data.emoji_id   = arr[2];
		if (arr[3] !== undefined && arr[3].length > 0) data.timeout    = parseInt(arr[3]);
		return data;
	}

	async ResolveStatusField(text = "") {
		let evalPrefix = "eval ";
		if (!text.startsWith(evalPrefix)) return text;

		try {
			return eval(text.substr(evalPrefix.length));
		} catch (e) {
			BdApi.showToast(e, {type: "error"});
			return "";
		}
	}

	AnimationLoop(i = 0) {
		i %= this.animation.length;
		// Every loop needs its own shouldContinue variable, otherwise there
		// is the possibility of multiple loops running simultaneously
		let shouldContinue = true;
		this.loop = undefined;
		this.cancel = () => { shouldContinue = false; };

		Promise.all([this.ResolveStatusField(this.animation[i].text),
		             this.ResolveStatusField(this.animation[i].emoji_name),
		             this.ResolveStatusField(this.animation[i].emoji_id)]).then(p => {
			Status.Set(this.ConfigObjectFromArray(p));
			this.cancel = undefined;

			if (shouldContinue) {
				let timeout = this.animation[i].timeout || this.timeout;
				this.loop = setTimeout(() => { this.AnimationLoop(i + 1); }, timeout);
			}
		});
	}

	NewEditorRow({text, emoji_name, emoji_id, timeout} = {}) {
		let hbox = GUI.newHBox();
		hbox.style.marginBottom = this.kSpacing;

		let textWidget = hbox.appendChild(GUI.newInput(text, "Text"));
		textWidget.style.marginRight = this.kSpacing;

		let emojiWidget = hbox.appendChild(GUI.newInput(emoji_name, "👍" + (this.currentUser.premiumType ? " / Nitro Name" : "")));
		emojiWidget.style.marginRight = this.kSpacing;
		emojiWidget.style.width = "140px";

		let optNitroIdWidget = hbox.appendChild(GUI.newInput(emoji_id, "Nitro ID"));
		if (!this.currentUser.premiumType) optNitroIdWidget.style.display = "none";
		optNitroIdWidget.style.marginRight = this.kSpacing;
		optNitroIdWidget.style.width = "140px";

		let optTimeoutWidget = hbox.appendChild(GUI.newNumericInput(timeout, this.kMinTimeout, "Time"));
		optTimeoutWidget.style.width = "75px";

		hbox.onkeydown = (e) => {
			let activeContainer = document.activeElement.parentNode;
			let activeIndex = Array.from(activeContainer.children).indexOf(document.activeElement);

			let keymaps = {
				"Delete": [
					[[false, true], () => {
						activeContainer = hbox.nextSibling || hbox.previousSibling;
						hbox.parentNode.removeChild(hbox);
					}],
				],

				"ArrowDown": [
					[[true, true], () => {
						activeContainer = this.NewEditorRow();
						hbox.parentNode.insertBefore(activeContainer, hbox.nextSibling);
					}],
					[[false, true], () => {
						let next = hbox.nextSibling;
						if (next != undefined) {
							next.replaceWith(hbox);
							hbox.parentNode.insertBefore(next, hbox);
						}
					}],
					[[false, false], () => {
						activeContainer = hbox.nextSibling;
					}],
				],

				"ArrowUp": [
					[[true, true], () => {
						activeContainer = this.NewEditorRow();
						hbox.parentNode.insertBefore(activeContainer, hbox);
					}],
					[[false, true], () => {
						let prev = hbox.previousSibling;
						if (prev != undefined) {
							prev.replaceWith(hbox);
							hbox.parentNode.insertBefore(prev, hbox.nextSibling);
						}
					}],
					[[false, false], () => {
						activeContainer = hbox.previousSibling;
					}],
				],
			};

			let letter = keymaps[e.key];
			if (letter == undefined) return;

			for (let i = 0; i < letter.length; i++) {
				if (letter[i][0][0] != e.ctrlKey || letter[i][0][1] != e.shiftKey)
					continue;

				letter[i][1]();
				if (activeContainer) activeContainer.children[activeIndex].focus();
				e.preventDefault();
				return;
			}
		};
		return hbox;
	}

	EditorFromJSON(json) {
		let out = document.createElement("div");
		for (let i = 0; i < json.length; i++) {
			out.appendChild(this.NewEditorRow(json[i]));
		}
		return out;
	}

	JSONFromEditor(editor) {
		return Array.prototype.slice.call(editor.childNodes).map(row => {
			return this.ConfigObjectFromArray(Array.prototype.slice.call(row.childNodes).map(e => e.value));
		});
	}

	// Settings
	getSettingsPanel() {
		let settings = document.createElement("div");
		settings.style.padding = "10px";

		// timeout
		settings.appendChild(GUI.newLabel("Step-Duration (3000: 3 seconds, 3500: 3.5 seconds, ...), overwritten by invididual steps"));
		let timeout = settings.appendChild(GUI.newNumericInput(this.timeout, this.kMinTimeout));
		timeout.style.marginBottom = this.kSpacing;

		// Animation Container
		settings.appendChild(GUI.newLabel("Animation"));
		let animationContainer = settings.appendChild(document.createElement("div"));
		animationContainer.marginBottom = this.kSpacing;

		// Editor
		let edit = animationContainer.appendChild(this.EditorFromJSON(this.animation));

		// Actions
		let actions = settings.appendChild(GUI.newHBox());

		// Add Step
		let addStep = actions.appendChild(GUI.setSuggested(GUI.newButton("+", false)));
		addStep.title = "Add step to end";
		addStep.onclick = () => edit.appendChild(this.NewEditorRow());

		// Del Step
		let delStep = actions.appendChild(GUI.setDestructive(GUI.newButton("-", false)));
		delStep.title = "Remove last step";
		delStep.style.marginLeft = this.kSpacing;
		delStep.onclick = () => edit.removeChild(edit.childNodes[edit.childNodes.length - 1]);

		// Move save to the right (XXX make use of flexbox)
		actions.appendChild(GUI.setExpand(document.createElement("div"), 2));

		// Save
		let save = actions.appendChild(GUI.newButton("Save"));
		GUI.setSuggested(save, true);
		save.onclick = () => {
			try {
				// Set timeout
				this.SetData("timeout", parseInt(timeout.value));
				this.SetData("animation", this.JSONFromEditor(edit));
			} catch (e) {
				BdApi.showToast(e, {type: "error"});
				return;
			}

			// Show Toast
			BdApi.showToast("Settings were saved!", {type: "success"});

			// Restart
			this.stop();
			this.load();
			this.start();
		};
		// End
		return settings;
	}
}

/* Status API */
const Status = {
	strerror: (req) => {
		if (req.status  < 400) return undefined;
		if (req.status == 401) return "Invalid AuthToken";

		// Discord _sometimes_ returns an error message
		let json = JSON.parse(req.response);
		for (const s of ["errors", "custom_status", "text", "_errors", 0, "message"])
			if ((json == undefined) || ((json = json[s]) == undefined))
				return "Unknown error. Please report at github.com/toluschr/BetterDiscord-Animated-Status";

		return json;
	},

	Set: async (status) => {
		let req = new XMLHttpRequest();
		req.open("PATCH", "/api/v9/users/@me/settings", true);
		req.setRequestHeader("authorization", Status.authToken);
		req.setRequestHeader("content-type", "application/json");
		req.onload = () => {
			let err = Status.strerror(req);
			if (err != undefined)
				BdApi.showToast(`Animated Status: Error: ${err}`, {type: "error"});
		};
		if (status === {}) status = null;
		req.send(JSON.stringify({custom_status: status}));
	},
};

// Used to easily style elements like the 'native' discord ones
const GUI = {
	newInput: (text = "", placeholder = "") => {
		let input = document.createElement("input");
		input.className = "inputDefault-_djjkz input-cIJ7To";
		input.value = String(text);
		input.placeholder = String(placeholder);
		return input;
	},

	newNumericInput: (text = "", minimum = 0, placeholder = "") => {
		let out = GUI.newInput(text, placeholder);
		out.setAttribute("type", "number");
		out.addEventListener("focusout", () => {
			if (parseInt(out.value) < minimum) {
				out.value = String(minimum);
				BdApi.showToast(`Value must not be lower than ${minimum}`, {type: "error"});
			}
		});
		return out;
	},

	newLabel: (text = "") => {
		let label = document.createElement("h5");
		label.className = "h5-18_1nd";
		label.innerText = String(text);
		return label;
	},

	newButton: (text, filled = true) => {
		let button = document.createElement("button");
		button.className = "button-38aScr colorBrand-3pXr91 sizeSmall-2cSMqn grow-q77ONN";
		if (filled) button.classList.add("lookFilled-1Gx00P");
		else button.classList.add("lookOutlined-3sRXeN");
		button.innerText = String(text);
		return button;
	},

	newHBox: () => {
		let hbox = document.createElement("div");
		hbox.style.display = "flex";
		hbox.style.flexDirection = "row";
		return hbox;
	},

	setExpand: (element, value) => {
		element.style.flexGrow = value;
		return element;
	},

	setSuggested: (element, value = true) => {
		if (value) element.classList.add("colorGreen-29iAKY");
		else element.classList.remove("mystyle");
		return element;
	},

	setDestructive: (element, value = true) => {
		if (value) element.classList.add("colorRed-1TFJan");
		else element.classList.remove("colorRed-1TFJan");
		return element;
	}
}
   
