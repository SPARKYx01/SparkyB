import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Graphe3DComponent } from './graphe3-d.component';

describe('Graphe3DComponent', () => {
  let component: Graphe3DComponent;
  let fixture: ComponentFixture<Graphe3DComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Graphe3DComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Graphe3DComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
