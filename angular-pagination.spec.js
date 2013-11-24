/* global expect: false, it: false, describe: false */
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
  it("should have correct values for previous",function(){
    pg.set({start: 40, limit: 20, total: 120})
    pg.set({start: pg.previous()})
    expect(pg.page).toBe(2)
    expect(pg.start).toBe(20)
  })
  it("should have correct values for next",function(){
    pg.set({start: 40, limit: 20, total: 120})
    pg.set({start: pg.next()})
    expect(pg.page).toBe(4)
    expect(pg.start).toBe(60)
  })
  it("should have correct values for first",function(){
    pg.set({start: 40, limit: 20, total: 120})
    pg.set({start: pg.first()})
    expect(pg.page).toBe(1)
    expect(pg.start).toBe(0)
  })
  it("should have correct values for last",function(){
    pg.set({start: 40, limit: 20, total: 120})
    pg.set({start: pg.last()})
    expect(pg.page).toBe(6)
    expect(pg.start).toBe(100)
  })
  it("should have correct values setting forPage",function(){
    pg.set({start: 40, limit: 20, total: 120})
    pg.set({start: pg.forPage(2)})
    expect(pg.page).toBe(2)
    expect(pg.start).toBe(20)
  })
  it("should not be able to page above max", function(){
    pg.set({start: 40, limit: 20, total: 120})
    pg.set({start: pg.forPage(20)})
    expect(pg.page).toBe(6)
    expect(pg.start).toBe(100)
  })
  it("should not be able to page below min",function(){
    pg.set({start: 40, limit: 20, total: 120})
    pg.set({start: pg.forPage(-50)})
    expect(pg.page).toBe(1)
    expect(pg.start).toBe(0)
  })
  it("should not be able to previous below min",function(){
    pg.set({start: 40, limit: 20, total: 120})
    pg.set({start: pg.first()})
    pg.set({start: pg.previous()})
    expect(pg.page).toBe(1)
    expect(pg.start).toBe(0)
  })
  it("should not be able to next above max",function(){
    pg.set({start: 40, limit: 20, total: 120})
    pg.set({start: pg.last()})
    pg.set({start: pg.next()})
    expect(pg.page).toBe(6)
    expect(pg.start).toBe(100)
  })
  it("should have correct range values",function(){
    pg.set({start: 40, limit: 20, total: 120})
    expect(pg.range.start).toBe(41)
    expect(pg.range.end).toBe(60)
    expect(pg.range.total).toBe(120)
  })
  it("should generate 5 buttons with 4 on the right at the beginning",function(){
    pg.set({start: 40, limit: 20, total: 120})
    pg.set({start: pg.first()})
    var buttons = pg.buttons()
    expect(buttons.length).toBe(pg.buttons_max)
    expect(buttons.shift()).toBe(1)
    expect(buttons.pop()).toBe(5)
  })
  it("should generate 5 buttons with 2 on each side",function(){
    pg.set({start: 40, limit: 20, total: 120})
    pg.set({start: pg.forPage(3)})
    var buttons = pg.buttons()
    expect(buttons.length).toBe(pg.buttons_max)
    expect(buttons.shift()).toBe(1)
    expect(buttons.pop()).toBe(5)
  })
  it("should generate 5 buttons with 4 on the left at the end",function(){
    pg.set({start: 40, limit: 20, total: 120})
    pg.set({start: pg.last()})
    var buttons = pg.buttons()
    expect(buttons.length).toBe(pg.buttons_max)
    expect(buttons.shift()).toBe(2)
    expect(buttons.pop()).toBe(6)
  })
  it("should generate 5 buttons with 3 on the left and 1 on the right close to the end",function(){
    pg.set({start: 40, limit: 20, total: 120})
    pg.set({start: pg.forPage(pg.pages - 1)})
    var buttons = pg.buttons()
    expect(buttons.length).toBe(pg.buttons_max)
    expect(buttons.shift()).toBe(2)
    expect(buttons.pop()).toBe(6)
  })
  it("should generate 5 buttons with 3 on the right and 1 on the right close to the beginning",function(){
    pg.set({start: 40, limit: 20, total: 120})
    pg.set({start: pg.forPage(2)})
    var buttons = pg.buttons()
    expect(buttons.length).toBe(pg.buttons_max)
    expect(buttons.shift()).toBe(1)
    expect(buttons.pop()).toBe(5)
  })
  it("should generate 3 buttons with 1 on each side",function(){
    pg.set({start: 0, limit: 10, total: 30})
    pg.set({start: pg.forPage(2)})
    var buttons = pg.buttons()
    expect(buttons.length).toBe(3)
    expect(buttons.shift()).toBe(1)
    expect(buttons.pop()).toBe(3)
  })
  it("should generate 3 buttons with 2 on the right at the beginning",function(){
    pg.set({start: 0, limit: 10, total: 30})
    pg.set({start: pg.first()})
    var buttons = pg.buttons()
    expect(buttons.length).toBe(3)
    expect(buttons.shift()).toBe(1)
    expect(buttons.pop()).toBe(3)
  })
  it("should generate 3 buttons with 2 on the left at the end",function(){
    pg.set({start: 0, limit: 10, total: 30})
    pg.set({start: pg.last()})
    var buttons = pg.buttons()
    expect(buttons.length).toBe(3)
    expect(buttons.shift()).toBe(1)
    expect(buttons.pop()).toBe(3)
  })
})
