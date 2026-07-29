interface SystemJsLoader {
  import(moduleName: string): Promise<unknown>;
}

declare const System: SystemJsLoader;
