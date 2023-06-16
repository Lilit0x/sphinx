// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use database::{Exam, ExamResult};
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

#[tauri::command]
fn get_exams_by_class(app_handle: AppHandle, class: String) -> Result<Vec<Exam>, String> {
    match app_handle.db(|db| database::get_exams_by_class(class, db)) {
        Ok(exams) => Ok(exams),
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
fn get_exam_by_id(app_handle: AppHandle, id: i8) -> Result<Vec<Exam>, String> {
    match app_handle.db(|db| database::get_exam_by_id(id, db)) {
        Ok(exams) => Ok(exams),
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
fn start_exam(app_handle: AppHandle, result: ExamResult) -> Result<ExamResult, String> {
    match app_handle.db(|db| database::initialize_result(result, db)) {
        Ok(res) => Ok(res),
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
fn finish_exam(app_handle: AppHandle, result: ExamResult) -> Result<String, String> {
    match app_handle.db(|db| database::update_student_result(result, db)) {
        Ok(_) => Ok("Updated Successfully".into()),
        Err(err) => Err(err.to_string()),
    }
}

fn main() {
    tauri::Builder::default()
        .manage(AppState {
            db: Default::default(),
        })
        .invoke_handler(tauri::generate_handler![
            my_custom_command,
            upload_exam,
            get_exams_by_class,
            get_exam_by_id,
            start_exam,
            finish_exam,
        ])
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
