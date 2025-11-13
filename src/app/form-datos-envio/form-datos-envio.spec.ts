import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDatosEnvio } from './form-datos-envio';

describe('FormDatosEnvio', () => {
  let component: FormDatosEnvio;
  let fixture: ComponentFixture<FormDatosEnvio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDatosEnvio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormDatosEnvio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
