import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoQR } from './pago-qr';

describe('PagoQR', () => {
  let component: PagoQR;
  let fixture: ComponentFixture<PagoQR>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagoQR]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagoQR);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
