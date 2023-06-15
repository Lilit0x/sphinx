use rusqlite::{named_params, Connection};
use serde::{self, Deserialize, Serialize};
use std::fs;
use tauri::AppHandle;

const CURRENT_DB_VERSION: u32 = 1;

/// Initializes the database connection, creating the .sqlite file if needed, and upgrading the database
/// if it's out of date.
pub fn initialize_database(app_handle: &AppHandle) -> Result<Connection, rusqlite::Error> {
    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .expect("The app data directory should exist.");
    fs::create_dir_all(&app_dir).expect("The app data directory should be created.");
    let sqlite_path = app_dir.join("al_qalam_db.sqlite");
    println!("{:?}", sqlite_path);
    let mut db = Connection::open(sqlite_path)?;

    let mut user_pragma = db.prepare("PRAGMA user_version")?;
    let existing_user_version: u32 = user_pragma.query_row([], |row| Ok(row.get(0)?))?;
    drop(user_pragma);

    upgrade_database_if_needed(&mut db, existing_user_version)?;

    Ok(db)
}

/// Upgrades the database to the current version.
pub fn upgrade_database_if_needed(
    db: &mut Connection,
    existing_version: u32,
) -> Result<(), rusqlite::Error> {
    if existing_version < CURRENT_DB_VERSION {
        db.pragma_update(None, "journal_mode", "WAL")?;

        let tx = db.transaction()?;

        tx.pragma_update(None, "user_version", CURRENT_DB_VERSION)?;

        tx.execute_batch(
            "
      CREATE TABLE exams (
        id INTEGER PRiMARY KEY,
        duration INTEGER NOT NULL,
        subject_teacher_name TEXT NOT NULL,
        subject TEXT NOT NULL,
        uploader_name TEXT NOT NULL,
        class TEXT NOT NULL,
        total_questions INTEGER NOT NULL,
        questions TEXT NOT NULL,
        created_at DATE DEFAULT CURRENT_TIMESTAMP
      );",
        )?;

        tx.commit()?;
    }

    Ok(())
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Exam {
    id: Option<i8>,
    duration: i32,
    #[serde(rename = "subjectTeacherName")]
    subject_teacher_name: String,
    #[serde(rename = "uploaderName")]
    uploader_name: String,
    subject: String,
    class: String,
    #[serde(rename = "totalQuestions")]
    total_questions: i32,
    questions: String,
    created_at: Option<String>,
}

// pub fn add_item(title: &str, db: &Connection) -> Result<(), rusqlite::Error> {
//     let mut statement = db.prepare("INSERT INTO items (title) VALUES (@title)")?;
//     statement.execute(named_params! { "@title": title })?;

//     Ok(())
// }

pub fn add_exam(exam: Exam, db: &Connection) -> Result<(), rusqlite::Error> {
    let mut stmt = db.prepare("INSERT INTO exams (duration, subject_teacher_name, subject, class, total_questions, questions, uploader_name) VALUES (@duration, @subject_teacher_name, @subject, @class, @total_questions, @questions, @uploader_name)")?;
    stmt.execute(named_params! { "@duration": exam.duration, "@subject_teacher_name": exam.subject_teacher_name, "@subject": exam.subject, "@class": exam.class, "@total_questions": exam.total_questions, "@questions": exam.questions, "@uploader_name": exam.uploader_name})?;
    Ok(())
}

// pub fn get_all(db: &Connection) -> Result<Vec<String>, rusqlite::Error> {
//     let mut statement = db.prepare("SELECT * FROM items")?;
//     let mut rows = statement.query([])?;
//     let mut items = Vec::new();
//     while let Some(row) = rows.next()? {
//         let title: String = row.get("title")?;

//         items.push(title);
//     }

//     Ok(items)
// }
