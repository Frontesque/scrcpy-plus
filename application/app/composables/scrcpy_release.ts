import { invoke } from "@tauri-apps/api/core";

export const SCRCPY_RELEASES_URL = "https://api.github.com/repos/Genymobile/scrcpy/releases";

// Release assets look like scrcpy-win64-vX.zip or scrcpy-linux-x86_64-vX.tar.gz
export function find_scrcpy_asset(assets: any[], os: string, arch: string) {
  const prefix = os === "windows"
    ? (arch === "x86" ? "scrcpy-win32-" : "scrcpy-win64-")
    : `scrcpy-${os}-${arch}-`;
  return assets.find(a => a.name.startsWith(prefix) && /\.(zip|tar\.gz)$/.test(a.name));
}

// Downloads a release and makes it the active scrcpy/adb
export async function install_scrcpy_release(url: string, version: string) {
  const paths: any = await invoke("download_scrcpy", { url, version });
  localStorage.setItem("scrcpyplus.scrcpy_path", paths.scrcpy_path);
  localStorage.setItem("scrcpyplus.adb_path", paths.adb_path);
  await invoke("set_binary_paths", { scrcpyPath: paths.scrcpy_path, adbPath: paths.adb_path });
  return paths;
}

export async function install_latest_scrcpy() {
  const env: any = await invoke("environment");
  const releases: any[] = await $fetch(SCRCPY_RELEASES_URL);
  for (const rel of releases) {
    if (rel.draft || rel.prerelease) continue;
    const asset = find_scrcpy_asset(rel.assets, env.os, env.arch);
    if (asset) return install_scrcpy_release(asset.browser_download_url, rel.tag_name);
  }
  throw new Error("No build available for this platform");
}
