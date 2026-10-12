export interface ToastItem {
	id: number;
	message: string;
}

const DEFAULT_DURATION_MS = 4000;

class ToastStore {
	items = $state<ToastItem[]>([]);
	#nextId = 1;

	/** Shows a message bottom-centre (mobile) / bottom-right (desktop). Auto-dismisses after 4s. */
	show(message: string, durationMs = DEFAULT_DURATION_MS): number {
		const id = this.#nextId++;
		this.items.push({ id, message });
		setTimeout(() => this.dismiss(id), durationMs);
		return id;
	}

	dismiss(id: number) {
		this.items = this.items.filter((item) => item.id !== id);
	}
}

export const toast = new ToastStore();
