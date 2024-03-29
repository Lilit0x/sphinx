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
    let mut db = Connection::open(sqlite_path)?;

    let mut user_pragma = db.prepare("PRAGMA user_version")?;
    let existing_user_version: u32 = user_pragma.query_row([], |row| row.get(0))?;
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
        id INTEGER PRIMARY KEY,
        duration INTEGER NOT NULL,
        subject_teacher_name TEXT NOT NULL,
        subject TEXT NOT NULL,
        uploader_name TEXT NOT NULL,
        class TEXT NOT NULL,
        total_questions INTEGER NOT NULL,
        questions TEXT NOT NULL,
        created_at DATE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE results (
        id INTEGER PRIMARY KEY,
        student_name TEXT NOT NULL,
        started_at DATE DEFAULT CURRENT_TIMESTAMP,
        score INTEGER,
        correct_answers INTEGER,
        wrong_answers INTEGER,
        submitted_at DATE,
        exam_id INTEGER NOT NULL,
        FOREIGN KEY (exam_id) REFERENCES exams(id)
      );
      ",
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
    #[serde(rename = "createdAt")]
    created_at: Option<String>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct ExamResult {
    id: Option<i8>,
    #[serde(rename = "studentName")]
    student_name: String,
    #[serde(rename = "startedAt")]
    started_at: Option<String>,
    score: Option<i32>,
    #[serde(rename = "correctAnswers")]
    correct_answers: Option<i32>,
    #[serde(rename = "wrongAnswers")]
    wrong_answers: Option<i32>,
    #[serde(rename = "examId")]
    exam_id: i8,
    #[serde(rename = "submittedAt")]
    submitted_at: Option<String>,
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

pub fn get_exams_by_class(class: String, db: &Connection) -> Result<Vec<Exam>, rusqlite::Error> {
    let mut statement = db.prepare("SELECT * FROM exams WHERE class = :class")?;
    let exam_iter = statement.query_map(named_params! { ":class": class }, |row| {
        Ok(Exam {
            id: Some(row.get("id")?),
            duration: row.get("duration")?,
            subject_teacher_name: row.get("subject_teacher_name")?,
            uploader_name: row.get("uploader_name")?,
            subject: row.get("subject")?,
            class: row.get("class")?,
            total_questions: row.get("total_questions")?,
            questions: row.get("questions")?,
            created_at: Some(row.get("created_at")?),
        })
    })?;

    let mut exams = Vec::new();
    for row in exam_iter {
        exams.push(row.unwrap());
    }

    Ok(exams)
}

pub fn get_exam_by_id(id: i8, db: &Connection) -> Result<Vec<Exam>, rusqlite::Error> {
    let mut statement = db.prepare("SELECT * FROM exams WHERE id = :id")?;
    let exam_iter = statement.query_map(named_params! { ":id": id }, |row| {
        Ok(Exam {
            id: Some(row.get("id")?),
            duration: row.get("duration")?,
            subject_teacher_name: row.get("subject_teacher_name")?,
            uploader_name: row.get("uploader_name")?,
            subject: row.get("subject")?,
            class: row.get("class")?,
            total_questions: row.get("total_questions")?,
            questions: row.get("questions")?,
            created_at: Some(row.get("created_at")?),
        })
    })?;

    let mut exams = Vec::new();
    for row in exam_iter {
        exams.push(row.unwrap());
    }

    Ok(exams)
}

pub fn initialize_result(
    result: ExamResult,
    db: &Connection,
) -> Result<ExamResult, rusqlite::Error> {
    let query = "INSERT INTO results 
    (student_name, exam_id) 
    VALUES (@student_name, @exam_id)";
    let mut stmt = db.prepare(query)?;
    stmt.execute(
        named_params! { "@student_name": result.student_name, "@exam_id": result.exam_id },
    )?;
    let result_id = db.last_insert_rowid();
    get_result_by_id(result_id, db)
}

pub fn get_result_by_id(id: i64, db: &Connection) -> Result<ExamResult, rusqlite::Error> {
    let mut statement = db.prepare("SELECT * FROM results WHERE id = :id")?;
    let results_iter = statement.query_map(named_params! { ":id": id }, |row| {
        Ok(ExamResult {
            id: Some(row.get("id")?),
            student_name: row.get("student_name")?,
            started_at: Some(row.get("started_at")?),
            score: None,
            correct_answers: None,
            wrong_answers: None,
            exam_id: row.get("exam_id")?,
            submitted_at: None,
        })
    })?;

    let mut results = Vec::new();
    for row in results_iter {
        results.push(row.unwrap());
    }

    Ok(results.first().unwrap().clone())
}

pub fn update_student_result(result: ExamResult, db: &Connection) -> Result<(), rusqlite::Error> {
    let query = "UPDATE results 
        SET  
            score = :score,
            correct_answers = :correct_answers,
            wrong_answers = :wrong_answers,
            submitted_at = CURRENT_TIMESTAMP
        WHERE id = :id";
    let mut stmt = db.prepare(query)?;
    stmt.execute(named_params! { ":score": result.score, ":correct_answers": result.correct_answers, ":wrong_answers": result.wrong_answers, ":id": result.id })?;
    Ok(())
}
