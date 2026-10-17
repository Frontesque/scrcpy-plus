use serde_json::{ json, Value };
use std::fs;
use std::io::{ Cursor, Read };
use std::path::{ Path, PathBuf };

// Only allow downloads from the official scrcpy release host
const ALLOWED_PREFIX: &str = "https://github.com/Genymobile/scrcpy/releases/download/";

fn find_file(dir: &Path, name: &str) -> Option<PathBuf> {
  for entry in fs::read_dir(dir).ok()?.flatten() {
    let path = entry.path();
    if path.is_dir() {
      if let Some(found) = find_file(&path, name) { return Some(found); }
    } else if path.file_name().map_or(false, |n| n == name) {
      return Some(path);
    }
  }
  None
}

pub fn download_and_extract(base: &Path, url: &str, version: &str) -> Result<Value, String> {
  if !url.starts_with(ALLOWED_PREFIX) { return Err("Untrusted download URL".into()); }
  if version.is_empty() || !version.chars().all(|c| c.is_ascii_alphanumeric() || c == '.' || c == '-') {
    return Err("Invalid version".into());
  }

  let mut bytes = Vec::new();
  ureq::get(url).call().map_err(|e| e.to_string())?
    .into_reader().read_to_end(&mut bytes).map_err(|e| e.to_string())?;

  let dest = base.join("scrcpy").join(version);
  if dest.exists() { fs::remove_dir_all(&dest).map_err(|e| e.to_string())?; }
  fs::create_dir_all(&dest).map_err(|e| e.to_string())?;

  if url.ends_with(".zip") {
    zip::ZipArchive::new(Cursor::new(bytes)).map_err(|e| e.to_string())?
      .extract(&dest).map_err(|e| e.to_string())?;
  } else {
    tar::Archive::new(flate2::read::GzDecoder::new(Cursor::new(bytes)))
      .unpack(&dest).map_err(|e| e.to_string())?;
  }

  let ext = if cfg!(windows) { ".exe" } else { "" };
  let scrcpy = find_file(&dest, &format!("scrcpy{}", ext)).ok_or("scrcpy executable not found in archive")?;
  let adb = find_file(&dest, &format!("adb{}", ext)).ok_or("adb executable not found in archive")?;

  #[cfg(unix)]
  {
    use std::os::unix::fs::PermissionsExt;
    for p in [&scrcpy, &adb] {
      fs::set_permissions(p, fs::Permissions::from_mode(0o755)).map_err(|e| e.to_string())?;
    }
  }

  Ok(json!({
    "scrcpy_path": scrcpy.to_string_lossy(),
    "adb_path":    adb.to_string_lossy()
  }))
}
