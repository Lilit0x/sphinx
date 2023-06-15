// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use database::Exam;
use state::{AppState, ServiceAccess};
use tauri::{AppHandle, Manager, State};

mod database;
mod state;

#[tauri::command]
fn my_custom_command() -> String {
    "I was invoked from JS!".into()
}

#[tauri::command]
fn upload_exam(app_handle: AppHandle, exam: Exam) -> Result<String, String> {
    match app_handle.db(|db| database::add_exam(exam, db)) {
        Ok(_) => Ok("Upload Successful".into()),
        Err(err) => Err(err.to_string()),
    }
}

fn main() {
    tauri::Builder::default()
        .manage(AppState {
            db: Default::default(),
        })
        .invoke_handler(tauri::generate_handler![my_custom_command, upload_exam])
        .setup(|app| {
            let handle = app.handle();

            let app_state: State<AppState> = handle.state();
            let db =
                database::initialize_database(&handle).expect("Database initialize should succeed");
            *app_state.db.lock().unwrap() = Some(db);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
