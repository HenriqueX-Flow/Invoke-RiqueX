import fs from "fs";
import path from "path";
import { IBotConfig } from "../interface";

export class ConfigManager {
  private filePath: string;
  private config: IBotConfig;

  constructor() {
    this.filePath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "data",
      "settings.json",
    );
    this.config = this.load();
  }

  private load(): IBotConfig {
    if (fs.existsSync(this.filePath)) {
      return JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
    }

    const defaultConfig: IBotConfig = {
      autoread: true,
      autotyping: false,
      publicMode: true,
      anticall: false,
    };

    fs.writeFileSync(this.filePath, JSON.stringify(defaultConfig, null, 2));
    return defaultConfig;
  }

  private save() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.config, null, 2));
  }

  public get(key: keyof IBotConfig) {
    return this.config[key];
  }

  public set(key: keyof IBotConfig, value: boolean) {
    this.config[key] = value;
    this.save();
  }

  public toggle(key: keyof IBotConfig): boolean {
    this.config[key] = !this.config[key];
    this.save();
    return this.config[key];
  }
}
