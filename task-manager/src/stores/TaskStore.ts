import { makeAutoObservable } from "mobx";


export interface Task {
	id: number;
	title: string;
	text: string;
	isChecked: boolean;
	subTasks: Task[];     // Массив подзадач
}

class TaskStore {
	tasks: Task[] = [];

	constructor() {
		makeAutoObservable(this);
		this.loadTasks();
	}

	addTask(title: string, text: string, parentId?: number) {
		const newTask: Task = {
			id: Date.now(),
			title,
			text,
			isChecked: false,
			subTasks: [],
		};

		// Если передан parentId, значит это подзадача, иначе это основная задача
		if (parentId) {

			const parentTask = this.findTaskById(parentId, this.tasks);
			if (parentTask) {
				// Добавляем новую задачу в массив подзадач родителя
				parentTask.subTasks.push(newTask);
			}
		} else {
			this.tasks.push(newTask);
		}

		// Сохраняем обновленный список задач в localStorage
		this.saveTasks();
	}

	toggleTask(taskId: number, affectSubTasks: boolean = true) {

		const task = this.findTaskById(taskId, this.tasks);
		if (task) {

			task.isChecked = !task.isChecked;


			if (affectSubTasks) {
				this.toggleSubTasks(task, task.isChecked);
			}


			this.saveTasks();
		}
	}


	toggleSubTasks(task: Task, isChecked: boolean) {
		task.subTasks.forEach(subTask => {
			subTask.isChecked = isChecked;

			this.toggleSubTasks(subTask, isChecked);
		});
	}

	findTaskById(taskId: number, tasks: Task[]): Task | undefined {

		for (let task of tasks) {

			if (task.id === taskId) return task;

			const found = this.findTaskById(taskId, task.subTasks);
			if (found) return found;
		}
		return undefined;
	}


	removeTask(taskId: number) {

		this.tasks = this.removeTaskById(taskId, this.tasks);

		this.saveTasks();
	}


	removeTaskById(taskId: number, tasks: Task[]): Task[] {

		return tasks.filter(task => {
			if (task.id === taskId) return false;
			task.subTasks = this.removeTaskById(taskId, task.subTasks);
			return true;
		});
	}


	editTask(taskId: number, newTitle: string, newText: string) {

		const task = this.findTaskById(taskId, this.tasks);
		if (task) {

			task.title = newTitle;
			task.text = newText;

			this.saveTasks();
		}
	}


	saveTasks() {

		localStorage.setItem("tasks", JSON.stringify(this.tasks));
	}


	loadTasks() {

		const savedTasks = localStorage.getItem("tasks");
		if (savedTasks) {
			try {

				const parsedTasks = JSON.parse(savedTasks);
				if (Array.isArray(parsedTasks)) {

					this.tasks = parsedTasks;
				}
			} catch (error) {
				console.error("Ошибка при загрузке задач:", error);
			}
		}
	}
}

const taskStore = new TaskStore();
export default taskStore;
