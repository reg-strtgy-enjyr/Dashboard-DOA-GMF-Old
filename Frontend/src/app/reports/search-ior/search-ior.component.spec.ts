import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchIorComponent } from './search-ior.component';

describe('SearchIorComponent', () => {
  let component: SearchIorComponent;
  let fixture: ComponentFixture<SearchIorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchIorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchIorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
