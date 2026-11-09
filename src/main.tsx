import { createRoot } from 'react-dom/client';
import Dashboard from './app/dashboard';
import snapshot from './data/directory.json?raw';
import './app/globals.css';
import './app/explorer.css';

const app = document.getElementById('app');
if (!app) throw new Error('Missing directory mount point');
createRoot(app).render(<Dashboard data={JSON.parse(snapshot)} />);
