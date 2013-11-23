/* global expect: false */
"use strict";
describe("Angular Pagination", function(){
  var pg
  // load the app
  beforeEach(module("pagination"))
  // get service 
  beforeEach(inject(function(Pagination){
    pg = new Pagination()
  }))
  it("should have page values that match defaults", function(){
    expect(pg.pages).toBe(0)
    expect(pg.page).toBe(1)
    expect(pg.start).toBe(0)
    expect(pg.limit).toBe(10)
  })
  it("should have correct values after setting new params",function(){
    pg.set({start: 40, limit: 20, total: 120})
    expect(pg.pages).toBe(6)
    expect(pg.page).toBe(3)
    expect(pg.start).toBe(40)
    expect(pg.limit).toBe(20)
  })
  it("should have correct values using first/prev/next/last",function(){
    pg.set({start: 40, limit: 20, total: 120})
    expect(pg.pages).toBe(6)
    expect(pg.limit).toBe(20)
    pg.set({start: pg.previous()})
    expect(pg.page).toBe(2)
    expect(pg.start).toBe(20)
    pg.set({start: pg.next()})
    expect(pg.page).toBe(3)
    expect(pg.start).toBe(40)
    pg.set({start: pg.first()})
    expect(pg.page).toBe(1)
    expect(pg.start).toBe(0)
    pg.set({start: pg.last()})
    expect(pg.page).toBe(6)
    expect(pg.start).toBe(100)
    pg.set({start: pg.forPage(2)})
    expect(pg.page).toBe(2)
    expect(pg.start).toBe(20)
  })
  it("should not paginate outside min and max page", function(){
    //set non defaults and confirm
    pg.set({start: 40, limit: 20, total: 120})
    expect(pg.pages).toBe(6)
    expect(pg.limit).toBe(20)
    //set page way above max and make sure we didnt bleed over
    pg.set({start: pg.forPage(20)})
    expect(pg.page).toBe(6)
    expect(pg.start).toBe(100)
    //set page way below min and make sure we didnt bleed under
    pg.set({start: pg.forPage(-50)})
    expect(pg.page).toBe(1)
    expect(pg.start).toBe(0)
    //make sure previous doesnt go below 0
    pg.set({start: pg.first()})
    pg.set({start: pg.previous()})
    expect(pg.page).toBe(1)
    expect(pg.start).toBe(0)
    //make sure next doesnt go above max
    pg.set({start: pg.last()})
    pg.set({start: pg.next()})
    expect(pg.page).toBe(6)
    expect(pg.start).toBe(100)
  })
})
