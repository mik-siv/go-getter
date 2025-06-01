import { Spectator } from '@ngneat/spectator';
import { createComponentFactory } from '@ngneat/spectator/jest';
import { MockComponent, MockProvider } from 'ng-mocks';
import { AuthService } from '../shared/services/data-access/auth/auth.service';
import { UserService } from '../shared/services/data-access/user/user.service';

import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let spectator: Spectator<AuthComponent>;

  const createComponent = createComponentFactory({
    component: AuthComponent,
    imports: [MockComponent(LoginComponent), MockComponent(RegisterComponent)],
    providers: [MockProvider(AuthService), MockProvider(UserService)],
  });

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.component;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
