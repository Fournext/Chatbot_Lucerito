import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosTarjeta } from './datos-tarjeta';

describe('DatosTarjeta', () => {
  let component: DatosTarjeta;
  let fixture: ComponentFixture<DatosTarjeta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosTarjeta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosTarjeta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
