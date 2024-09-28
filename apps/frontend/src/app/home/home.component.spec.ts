import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { MockProvider } from 'ng-mocks';
import { AuthService } from '../shared/services/data-access/auth/auth.service';
import { GoalService } from '../shared/services/data-access/goal/goal.service';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { RequestStatus } from '../shared/services/data-access/models/RequestStatus';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        MockProvider(AuthService, {user: ()=>{}} as AuthService),
        MockProvider(GoalService, {
          getGoals: () => of([]),
          status: () => RequestStatus.PENDING,
        } as unknown as GoalService),
        provideNoopAnimations(),
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
