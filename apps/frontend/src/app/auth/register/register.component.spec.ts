import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { MockProvider } from 'ng-mocks';
import { AuthService } from '../../shared/services/data-access/auth/auth.service';
import { UserService } from '../../shared/services/data-access/user/user.service';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        MockProvider(AuthService),
        MockProvider(UserService),
        provideNoopAnimations()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
