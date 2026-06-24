use once_cell::sync::Lazy;
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use sysinfo::System;

static SYSTEM: Lazy<Mutex<System>> = Lazy::new(|| {
    let mut sys = System::new_all();
    sys.refresh_all();
    Mutex::new(sys)
});

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct SystemInfo {
    cpu_usage: f32,
    memory_usage: u64,
    total_memory: u64,
}

#[tauri::command]
fn get_system_info() -> SystemInfo {
    let mut sys = SYSTEM.lock().unwrap();

    sys.refresh_all();

    let cpu_usage = sys.global_cpu_info().cpu_usage();

    SystemInfo {
        cpu_usage,
        memory_usage: sys.used_memory(),
        total_memory: sys.total_memory(),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_system_info])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}