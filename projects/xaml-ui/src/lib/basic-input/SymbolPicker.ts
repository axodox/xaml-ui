import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import ms from "milsymbol";
import { FrameworkElementComponent } from "../FrameworkElement";
import { ComboBoxComponent } from "./ComboBox";
import { TextBoxComponent } from "../text/TextBox";
import {
  Affiliations, BattleDimensions, CodingSchemes, getFunctionIcons,
  Modifier1Options, Modifier2Options, Statuses, SymbolOption
} from "./SymbolData";

/**
 * A military-symbol picker (a "unit generator") for MIL-STD-2525C SIDC codes.
 * Renders a live milsymbol preview and edits the code through dropdowns for the
 * basic fields (coding scheme, affiliation, battle dimension, status, function,
 * and two modifiers) plus a manual code field. The code and the dropdowns stay in
 * two-way sync, and the preview reflects validity.
 *
 * `Code` is the 15-character SIDC string (in/out); `CodeChange` emits on edits.
 */
@Component({
  selector: 'SymbolPicker',
  imports: [CommonModule, ComboBoxComponent, TextBoxComponent],
  template: `<div class="header">
    <TextBox class="code" MinWidth="0px" [Text]="Code" UpdateTrigger="LostFocus" (TextChange)="onCodeText($event)" />
  </div>
  <div class="body">
    <div class="preview-panel">
      <div #preview class="preview" [class.invalid]="!IsValid"></div>
      <div *ngIf="!IsValid" class="preview-error">Invalid symbol code</div>
    </div>

    <div class="field affiliation">
      <label>Affiliation</label>
      <ComboBox MinWidth="0px" [ItemSource]="Affiliations" DisplayMemberPath="Name" SelectedValuePath="Code"
        [SelectedValue]="Affiliation" (SelectedValueChange)="onFieldChange('Affiliation', $event)" />
    </div>

    <div class="field function">
      <label>Function</label>
      <ComboBox #functionCombo MinWidth="0px" [ItemSource]="FunctionOptions" DisplayMemberPath="Name" SelectedValuePath="Code"
        [SelectedValue]="FunctionId" (SelectedValueChange)="onFieldChange('FunctionId', $event)" />
    </div>

    <div class="field status">
      <label>Status</label>
      <ComboBox MinWidth="0px" [ItemSource]="Statuses" DisplayMemberPath="Name" SelectedValuePath="Code"
        [SelectedValue]="Status" (SelectedValueChange)="onFieldChange('Status', $event)" />
    </div>

    <div class="field modifier1">
      <label>Modifier 1</label>
      <ComboBox MinWidth="0px" [ItemSource]="Modifier1Options" DisplayMemberPath="Name" SelectedValuePath="Code"
        [SelectedValue]="Modifier1" (SelectedValueChange)="onFieldChange('Modifier1', $event)" />
    </div>

    <div class="field scheme">
      <label>Coding scheme</label>
      <ComboBox MinWidth="0px" [ItemSource]="Schemes" DisplayMemberPath="Name" SelectedValuePath="Code"
        [SelectedValue]="Scheme" (SelectedValueChange)="onSchemeChange($event)" />
    </div>

    <div class="field dimension">
      <label>Battle dimension</label>
      <ComboBox MinWidth="0px" [ItemSource]="Dimensions" DisplayMemberPath="Name" SelectedValuePath="Code"
        [SelectedValue]="Dimension" (SelectedValueChange)="onDimensionChange($event)" />
    </div>

    <div class="field modifier2">
      <label>Modifier 2</label>
      <ComboBox MinWidth="0px" [ItemSource]="Modifier2Options" DisplayMemberPath="Name" SelectedValuePath="Code"
        [SelectedValue]="Modifier2" (SelectedValueChange)="onFieldChange('Modifier2', $event)" />
    </div>
  </div>`,
  styleUrl: 'SymbolPicker.scss'
})
export class SymbolPickerComponent extends FrameworkElementComponent implements AfterViewInit {

  // Option lists for the dropdowns.
  protected readonly Schemes = CodingSchemes;
  protected readonly Affiliations = Affiliations;
  protected readonly Dimensions = BattleDimensions;
  protected readonly Statuses = Statuses;
  protected readonly Modifier1Options = Modifier1Options;
  protected readonly Modifier2Options = Modifier2Options;
  protected FunctionOptions: SymbolOption[] = getFunctionIcons('S', 'G');

  // The individual SIDC fields, the source of truth for the dropdowns.
  protected Scheme = 'S';
  protected Affiliation = 'F';
  protected Dimension = 'G';
  protected Status = 'P';
  protected FunctionId = '------';
  protected Modifier1 = '-';
  protected Modifier2 = '-';

  protected IsValid = true;

  /** The preview symbol size passed to milsymbol. */
  @Input() Size: number = 40;

  private _code: string = 'SFGP-----------';
  get Code() {
    return this._code;
  }
  @Input() set Code(value: string) {
    if (value === this._code) return;
    this.parseCode(value);
    this.refreshFunctionOptions(true);
    this._code = this.buildCode();
    // Don't emit CodeChange here: this setter is driven by the parent via the
    // [(Code)] two-way binding, so echoing back synchronously (with the value
    // normalized to 15 chars) during change detection triggers NG0100. Only
    // genuine user edits (via commit) push a new value out to the parent.
    this.render();
  }

  @Output() CodeChange = new EventEmitter<string>();

  @ViewChild('preview')
  private _preview!: ElementRef<HTMLElement>;

  @ViewChild('functionCombo')
  private _functionCombo?: ComboBoxComponent;

  ngAfterViewInit(): void {
    this.render();
  }

  protected onSchemeChange(value: string) {
    // Ignore the echo the ComboBox emits when we set [SelectedValue] ourselves;
    // only a genuine user change (a different value) should reset the function.
    if (value == null || value === this.Scheme) return;
    this.Scheme = value;
    this.refreshFunctionOptions(false);
    this.commit();
  }

  protected onDimensionChange(value: string) {
    if (value == null || value === this.Dimension) return;
    this.Dimension = value;
    this.refreshFunctionOptions(false);
    this.commit();
  }

  protected onFieldChange(field: 'Affiliation' | 'Status' | 'FunctionId' | 'Modifier1' | 'Modifier2', value: string) {
    if (value == null || this[field] === value) return;
    this[field] = value;
    this.commit();
  }

  protected onCodeText(value: string) {
    this.parseCode(value);
    this.refreshFunctionOptions(true);
    this.commit();
  }

  // Rebuild the function list for the current scheme+dimension. When the current
  // function isn't offered by the new list: if `preserveCurrent` (a code was set
  // or typed) keep it as an ad-hoc entry so arbitrary codes round-trip; otherwise
  // (the user switched scheme/dimension) reset to the generic entry.
  private refreshFunctionOptions(preserveCurrent: boolean) {
    let options = getFunctionIcons(this.Scheme, this.Dimension);
    if (!options.some(o => o.Code === this.FunctionId)) {
      if (preserveCurrent) options = [...options, { Code: this.FunctionId, Name: this.FunctionId }];
      else this.FunctionId = options[0].Code;
    }
    this.FunctionOptions = options;
    this.scheduleFunctionSync();
  }

  // The ComboBox's inner ListView shares its ItemSource and resets its selection
  // to -1 when the list shrinks to one that no longer contains the previous
  // value, writing that -1 back over the correct selection through its two-way
  // [(SelectedIndex)] binding. FunctionOptions always contains the current
  // FunctionId, so re-assert the value once the item list has settled. Deferring
  // with setTimeout (as elsewhere in the library) lets change detection re-run.
  private scheduleFunctionSync() {
    setTimeout(() => {
      let combo = this._functionCombo;
      if (combo && combo.SelectedValue !== this.FunctionId) combo.SelectedValue = this.FunctionId;
    });
  }

  // Recompose the code from the fields, re-render, and emit if it changed.
  private commit() {
    let code = this.buildCode();
    if (code !== this._code) {
      this._code = code;
      this.CodeChange.emit(code);
    }
    // Render after updating _code so the preview reflects the current code, not
    // the previously-committed one.
    this.render();
  }

  // Assemble the 15-char SIDC: scheme|aff|dim|status (4) + functionId (6) +
  // modifier1 (1) + modifier2 (1) + country/order-of-battle (3, unused).
  private buildCode(): string {
    let code = this.Scheme + this.Affiliation + this.Dimension + this.Status
      + this.pad(this.FunctionId, 6) + (this.Modifier1 || '-') + (this.Modifier2 || '-');
    return code.padEnd(15, '-').slice(0, 15);
  }

  private parseCode(value: string) {
    let code = (value ?? '').toUpperCase().padEnd(15, '-');
    this.Scheme = code.charAt(0);
    this.Affiliation = code.charAt(1);
    this.Dimension = code.charAt(2);
    this.Status = code.charAt(3);
    this.FunctionId = code.slice(4, 10);
    this.Modifier1 = code.charAt(10);
    this.Modifier2 = code.charAt(11);
  }

  private pad(value: string, length: number): string {
    return (value ?? '').padEnd(length, '-').slice(0, length);
  }

  // Render the milsymbol SVG into the preview and update the validity flag. The
  // SVG is generated by us, so it is assigned directly (no sanitizer needed).
  private render() {
    if (!this._preview) return;
    let symbol = new ms.Symbol(this._code, { size: this.Size });
    this.IsValid = symbol.isValid() === true;
    this._preview.nativeElement.innerHTML = symbol.asSVG();
  }
}
