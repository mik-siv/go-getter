import { FormControl } from '@angular/forms';

export interface SubgoalEditForm {
  name: FormControl<string>;
  description: FormControl<string>;
}
