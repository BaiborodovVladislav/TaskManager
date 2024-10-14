import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import TaskTree from './components/TaskTree';
import ThemeSwitcher from './components/ThemeSwitcher';

const App: React.FC = () => {
	return (
		<ThemeProvider>
			<div>
				<ThemeSwitcher />
				<TaskTree />
			</div>
		</ThemeProvider>
	);
};

export default App;
