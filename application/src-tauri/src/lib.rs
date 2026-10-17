use serde_json::{ json, Value };
mod system_command;
mod downloader;
use tauri::Manager;
use system_command::{ scrcpy, adb };

#[tauri::command]
fn environment() -> Value {
  return json!({
    "app_version":  env!("CARGO_PKG_VERSION"),
    "releases_url": "https://api.github.com/repos/Frontesque/scrcpy-plus/releases",
    "is_windows":   cfg!(windows),
    "os":           std::env::consts::OS,
    "arch":         std::env::consts::ARCH
  });
}

#[tauri::command]
fn set_binary_paths(scrcpy_path: Option<String>, adb_path: Option<String>) {
  system_command::set_custom_paths(scrcpy_path, adb_path);
}

// Downloads a scrcpy release archive and extracts it to the app data folder,
// returning the paths of the extracted scrcpy and adb executables.
#[tauri::command]
async fn download_scrcpy(app: tauri::AppHandle, url: String, version: String) -> Result<Value, String> {
  let base = app.path().app_data_dir().map_err(|e| e.to_string())?;
  tauri::async_runtime::spawn_blocking(move || downloader::download_and_extract(&base, &url, &version))
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
fn get_dependency_versions() -> Value {
  let scrcpy_version: String = scrcpy(vec!["--version"]).split_whitespace().nth(1).unwrap_or("Unable to find SCRCPY").to_string();
  let adb_version:    String = adb(vec!["--version"]).split_whitespace().nth(6).unwrap_or("Unable to find ADB").to_string();
  return json!({
    "scrcpy_plus":  env!("CARGO_PKG_VERSION"),
    "scrcpy":       scrcpy_version,
    "adb":          adb_version
  });
}

#[tauri::command]
fn exec_adb(args: Vec<&str>) -> String {
  return adb(args);
}

#[tauri::command]
fn exec_scrcpy(args: Vec<&str>) -> String {
  return scrcpy(args);
}

#[tauri::command]
async fn run_scrcpy(args: Vec<String>) -> Result<(), String> {
  // Runs on a dedicated blocking thread and resolves once the scrcpy window is closed
  tauri::async_runtime::spawn_blocking(move || {
    let args_ref: Vec<&str> = args.iter().map(|a| a.as_str()).collect();
    scrcpy(args_ref);
  })
  .await
  .map_err(|e| e.to_string())
}

// #[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_opener::init())
    .plugin(tauri_plugin_dialog::init())
    .invoke_handler(tauri::generate_handler![get_dependency_versions, exec_adb, exec_scrcpy, run_scrcpy, environment, set_binary_paths, download_scrcpy])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
