export class OpenFilePicker {
  public FileTypeFilter?: FilePickerAcceptType[];
  public SettingsIdentifier?: string;
  public AllowMultiple?: boolean;
  public SuggestedStartLocation?: WellKnownDirectory;

  public static get SupportsFileSystemAccessApi() {
    return 'showOpenFilePicker' in window;
  }

  public async ShowAsync(): Promise<File[] | null> {
    if ('showOpenFilePicker' in window) {
      return await this.ShowFileSystemAccessPickerAsync();
    }
    else {
      return await this.ShowConventionalPickerAsync();
    }
  }

  private async ShowFileSystemAccessPickerAsync(): Promise<File[] | null> {
    try {
      //Show picker
      const fileHandles = await window.showOpenFilePicker({
        types: this.FileTypeFilter,
        id: this.SettingsIdentifier,
        multiple: this.AllowMultiple,
        startIn: this.SuggestedStartLocation,
        excludeAcceptAllOption: true
      });

      //Get results
      let results: File[] = [];
      for (const fileHandle of fileHandles) {
        results.push(await fileHandle.getFile());
      }

      return results;
    }
    catch {
      //Handle window close
      return null;
    }
  }

  private async ShowConventionalPickerAsync(): Promise<File[] | null> {
    return new Promise(resolve => {
      //Create input
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = false;

      //Apply filters
      if (this.FileTypeFilter) {
        input.accept = this.FileTypeFilter?.flatMap(p => p.accept ? Object.keys(p.accept) : []).join(',');
      }
      else {
        input.accept = "*/*";
      }

      //Subscribe to file event
      input.onchange = () => {
        if (input.files) {
          resolve(Array.from(input.files));
        }
        else {
          resolve(null);
        }
      };

      //Recognize picker close - de facto standard workaround
      window.addEventListener('focus', () => {
        setTimeout(() => {
          if (!input.files?.length) {
            resolve(null);
          }
        }, 300);
      }, { once: true });

      //Show dialog
      input.click();
    });
  }
}