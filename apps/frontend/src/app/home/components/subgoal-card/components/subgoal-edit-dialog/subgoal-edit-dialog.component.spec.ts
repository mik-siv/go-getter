import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubgoalEditDialogComponent } from './subgoal-edit-dialog.component';

describe('SubgoalEditDialogComponent', () => {
  let component: SubgoalEditDialogComponent;
  let fixture: ComponentFixture<SubgoalEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubgoalEditDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubgoalEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
