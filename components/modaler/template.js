export default {
	'modaler': (data = {}) => {
		return `
			<link rel="stylesheet" href= ${data['stylesheet'] ?? "./components.css"}>
			<div class="modaler-cont" data-mouseup="closeModal">
				<div class="modaler-inner" data-mouseup="cancelCloseModal">
					<div class="modaler-header">
						<button data-click="closeModal" class="modaler-close">X</button>
					</div>
					<div class="modaler-body">
						<slot name="modal-item"></slot>
					</div>
				</div>
			</div>
		`;
	}
}
