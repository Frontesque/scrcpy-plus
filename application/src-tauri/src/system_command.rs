use std::process::Command;
#[cfg(windows)]
use std::os::windows::process::CommandExt;
use std::str::from_utf8;

fn execute(command: &str, args: Vec<&str>) -> String {
    #[cfg(windows)]
    let command_capture = Command::new(&command)
        .creation_flags(0x08000000)
        .args(&args)
        .output();

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

    let output_str: &str = from_utf8(&output.stdout).expect("Unable to convert utf8 to string");
    return output_str.to_string();
}

#[cfg(windows)]
pub fn scrcpy(args: Vec<&str>) -> String {
    return execute("resources/scrcpy/scrcpy.exe", args);
}

#[cfg(not(windows))]
pub fn scrcpy(args: Vec<&str>) -> String {
    return execute("scrcpy", args);
}

#[cfg(windows)]
pub fn adb(args: Vec<&str>) -> String {
    return execute("resources/scrcpy/adb.exe", args);
}

#[cfg(not(windows))]
pub fn adb(args: Vec<&str>) -> String {
    return execute("adb", args);
}