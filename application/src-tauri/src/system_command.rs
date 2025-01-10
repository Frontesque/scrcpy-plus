use std::process::Command;
use std::os::windows::process::CommandExt;
use std::str::from_utf8;

const CREATE_NO_WINDOW: u32 = 0x08000000;

fn execute(command: &str, args: Vec<&str>) -> String {
    let output = Command::new(&command)
        .creation_flags(CREATE_NO_WINDOW)
        .args(&args)
        .output()
        .expect("Failed to execute command");
    let output_str: &str = from_utf8(&output.stdout).expect("Unable to convert utf8 to string");
    return output_str.to_string();
}

#[cfg(windows)]
pub fn scrcpy(args: Vec<&str>) -> String {
    return execute("resources/scrcpy/scrcpy.exe", args);
}

#[cfg(windows)]
pub fn adb(args: Vec<&str>) -> String {
    return execute("resources/scrcpy/adb.exe", args);
}