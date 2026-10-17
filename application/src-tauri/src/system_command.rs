use std::process::Command;
#[cfg(windows)]
use std::os::windows::process::CommandExt;
use std::sync::Mutex;
use std::path::Path;

static CUSTOM_SCRCPY: Mutex<Option<String>> = Mutex::new(None);
static CUSTOM_ADB: Mutex<Option<String>> = Mutex::new(None);

// An empty or non-existent path clears the override so the bundled binary is used
fn sanitize(path: Option<String>) -> Option<String> {
    path.filter(|p| Path::new(p).is_file())
}

pub fn set_custom_paths(scrcpy_path: Option<String>, adb_path: Option<String>) {
    *CUSTOM_SCRCPY.lock().unwrap() = sanitize(scrcpy_path);
    *CUSTOM_ADB.lock().unwrap() = sanitize(adb_path);
}

fn execute(command: &str, args: Vec<&str>) -> String {
    let mut cmd = Command::new(&command);
    cmd.args(&args);
    #[cfg(windows)]
    cmd.creation_flags(0x08000000);
    // scrcpy locates adb through this variable, so keep it consistent with the chosen adb
    if let Some(adb_path) = CUSTOM_ADB.lock().unwrap().clone() {
        cmd.env("ADB", adb_path);
    }

    let output = match cmd.output() {
        Ok(data) => data,
        Err(error) => {
            println!("{}", error);
            return "".to_string();
        },
    };

    return String::from_utf8_lossy(&output.stdout).to_string();
}

pub fn scrcpy(args: Vec<&str>) -> String {
    let default = if cfg!(windows) { "scrcpy/scrcpy.exe" } else { "scrcpy" };
    let command = CUSTOM_SCRCPY.lock().unwrap().clone().unwrap_or(default.to_string());
    return execute(&command, args);
}

pub fn adb(args: Vec<&str>) -> String {
    let default = if cfg!(windows) { "scrcpy/adb.exe" } else { "adb" };
    let command = CUSTOM_ADB.lock().unwrap().clone().unwrap_or(default.to_string());
    return execute(&command, args);
}
