use std::process::Command;
#[cfg(windows)]
use std::os::windows::process::CommandExt;
#[cfg(windows)]
use std::sync::Mutex;
#[cfg(windows)]
use std::path::Path;

#[cfg(windows)]
static CUSTOM_SCRCPY: Mutex<Option<String>> = Mutex::new(None);
#[cfg(windows)]
static CUSTOM_ADB: Mutex<Option<String>> = Mutex::new(None);

// An empty or non-existent path clears the override so the bundled binary is used
#[cfg(windows)]
fn sanitize(path: Option<String>) -> Option<String> {
    path.filter(|p| Path::new(p).is_file())
}

#[cfg(windows)]
pub fn set_custom_paths(scrcpy_path: Option<String>, adb_path: Option<String>) {
    *CUSTOM_SCRCPY.lock().unwrap() = sanitize(scrcpy_path);
    *CUSTOM_ADB.lock().unwrap() = sanitize(adb_path);
}

fn execute(command: &str, args: Vec<&str>) -> String {
    #[cfg(windows)]
    let command_capture = {
        let mut cmd = Command::new(&command);
        cmd.creation_flags(0x08000000).args(&args);
        // scrcpy locates adb through this variable, so keep it consistent with the chosen adb
        if let Some(adb_path) = CUSTOM_ADB.lock().unwrap().clone() {
            cmd.env("ADB", adb_path);
        }
        cmd.output()
    };

    #[cfg(not(windows))]
    let command_capture = Command::new(&command)
        .args(&args)
        .output();

    let output = match command_capture {
        Ok(data) => data,
        Err(error) => {
            println!("{}", error);
            return "".to_string();
        },
    };

    return String::from_utf8_lossy(&output.stdout).to_string();
}

#[cfg(windows)]
pub fn scrcpy(args: Vec<&str>) -> String {
    let command = CUSTOM_SCRCPY.lock().unwrap().clone().unwrap_or("scrcpy/scrcpy.exe".to_string());
    return execute(&command, args);
}

#[cfg(not(windows))]
pub fn scrcpy(args: Vec<&str>) -> String {
    return execute("scrcpy", args);
}

#[cfg(windows)]
pub fn adb(args: Vec<&str>) -> String {
    let command = CUSTOM_ADB.lock().unwrap().clone().unwrap_or("scrcpy/adb.exe".to_string());
    return execute(&command, args);
}

#[cfg(not(windows))]
pub fn adb(args: Vec<&str>) -> String {
    return execute("adb", args);
}