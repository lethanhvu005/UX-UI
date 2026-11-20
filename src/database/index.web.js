// Bản web chỉ để xem trước giao diện: dữ liệu giữ trong bộ nhớ.
import { groups } from '../groups.js';
let state = null;
export async function loadAppData() { return { groups, saved: false }; }
export async function commitGreenLiving() {}
export async function loadAppState() { return state; }
export async function saveAppState(s) { state = s; }
