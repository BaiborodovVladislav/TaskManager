import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import taskStore from "../stores/TaskStore";
import TaskItem from "./TaskItem";
import styles from "../styles/TaskManager.module.scss";

const TaskTree: React.FC = observer(() => {
	const [title, setTitle] = useState("");
	const [text, setText] = useState("");

	const handleAddTask = () => {    // добавил 
		if (title && text) {
			taskStore.addTask(title, text);
			setTitle("");
			setText("");
		}
	};

	return (
		<div className={styles.taskTree}>
			<h1 className={styles.title}>Task Manager</h1>
			<div className={styles.addTask}>
				<input
					placeholder="Название задачи"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
				<textarea
					placeholder="Описание задачи"
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				<button onClick={handleAddTask}>Добавить задачу</button>
			</div>
			{/* отображение списка задач */}
			<div className={styles.taskList}>
				{taskStore.tasks.map((task) => (
					<TaskItem key={task.id} task={task} />
				))}
			</div>
		</div >
	);
});

export default TaskTree;
