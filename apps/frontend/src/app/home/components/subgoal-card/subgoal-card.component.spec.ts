import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubgoalCardComponent } from './subgoal-card.component';
import { Subgoal } from '../../../shared/services/data-access/subgoal/models/subgoal.model';

describe('SubgoalCardComponent', () => {
  let component: SubgoalCardComponent;
  let fixture: ComponentFixture<SubgoalCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubgoalCardComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(SubgoalCardComponent);
    component = fixture.componentInstance;
    component.subgoal = { name: 'Test Subgoal', metadata: { description: 'Test Subgoal' } } as unknown as Subgoal;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
