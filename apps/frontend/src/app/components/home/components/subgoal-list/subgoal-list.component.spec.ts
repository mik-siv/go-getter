import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubgoalListComponent } from './subgoal-list.component';

describe('SubgoalListComponent', () => {
  let component: SubgoalListComponent;
  let fixture: ComponentFixture<SubgoalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubgoalListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubgoalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
