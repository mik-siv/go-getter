import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubgoalCardComponent } from './subgoal-card.component';

describe('SubgoalCardComponent', () => {
  let component: SubgoalCardComponent;
  let fixture: ComponentFixture<SubgoalCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubgoalCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubgoalCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
