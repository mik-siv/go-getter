import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthComponent } from './auth.component';
import { AuthService } from '../shared/services/data-access/auth/auth.service';
import { MockProvider } from 'ng-mocks';
import { UserService } from '../shared/services/data-access/user/user.service';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { RequestStatus } from '../shared/services/data-access/models/RequestStatus';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthComponent],
      providers: [
        MockProvider(AuthService, {status: ()=>RequestStatus.PENDING, user: ()=>{}} as AuthService),
        MockProvider(UserService),
        provideNoopAnimations()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
