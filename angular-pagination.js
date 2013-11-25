/* global angular: false */
"use strict";

var paginationModule = angular.module("pagination", [])

/**
 * The main pagination service that should be injected into the controller
 * to set the information needed from the backend
 */
paginationModule.factory("Pagination", function(){
  /**
   * Constructor accepts an object of params that get passed to set
   * @param obj
   */
  var pagination = function(obj){
    this.set(obj)
  }
  /**
   * Limit per page
   * @type {number}
   */
  pagination.prototype.limit = 10
  /**
   * Total number of records
   * @type {number}
   */
  pagination.prototype.total = 0
  /**
   * Starting record number
   * @type {number}
   */
  pagination.prototype.start = 0
  /**
   * Total number of pages
   * @type {number}
   */
  pagination.prototype.pages = 0
  /**
   * Current page
   * @type {number}
   */
  pagination.prototype.page = 1
  /**
   * Max number of page buttons to show
   * @type {number}
   */
  pagination.prototype.buttons_max = 5
  /**
   * Range variables for displaying record stats eg:
   *  {{ pg.range.start }} - {{ pg.range.end }} of {{ pg.range.total }} entries
   * @type {{start: number, end: number, total: number}}
   */
  pagination.prototype.range = {
    start: 0,
    end: 0,
    total: 0
  }
  /**
   * Startup pagination (do page math)
   */
  pagination.prototype.process = function(){
    this.pages = Math.ceil(this.total / this.limit)
    this.page = Math.ceil(this.start / this.limit) + 1
    this.range.start = (this.total > 0) ? (this.start + 1) : 0
    if(this.range.start > this.total)
      this.range.start = this.total
    if(this.start + this.limit < this.total)
      this.range.end = this.start + this.limit
    else
      this.range.end = this.total
    this.range.total = this.total
  }
  /**
   * Determine if the first page is currently selected
   * @returns {boolean}
   */
  pagination.prototype.isFirst = function(){
    return (1 === this.page)
  }
  /**
   * Determine if this last page is current selected
   * @returns {boolean}
   */
  pagination.prototype.isLast = function(){
    return ((0 === this.pages) || (this.page === this.pages))
  }
  /**
   * Get the starting point of the first page
   * @returns {number}
   */
  pagination.prototype.first = function(){
    return 0
  }
  /**
   * Get the safe starting point of the previous page
   * @returns {number}
   */
  pagination.prototype.previous = function(){
    return this.isFirst() ? 0 : this.start - this.limit
  }
  /**
   * Get the safe starting point of the next page
   * @returns {number}
   */
  pagination.prototype.next = function(){
    return this.isLast() ? this.start : this.start + this.limit
  }
  /**
   * Get the starting point of the last page
   * @returns {number}
   */
  pagination.prototype.last = function(){
    return Math.max(0,Math.floor((this.pages - 1) * this.limit))
  }
  /**
   * Get the starting point of a specific page
   * @param page
   * @returns {number}
   */
  pagination.prototype.forPage = function(page){
    page = parseInt(page,10) || 1
    if(page < 1) page = 1
    if(page > this.pages) page = this.pages
    return Math.max(0,(page - 1) * this.limit)
  }
  /**
   * When changing the limit this returns the new start value
   * @returns {number}
   */
  pagination.prototype.forLimitChange = function(){
    return ((this.pages - 1) * this.limit)
  }
  /**
   * Get a range of buttons
   *  Use the buttons_max setting to change the amount, defaults to 5
   * @returns {Array}
   */
  pagination.prototype.buttons = function(){
    var buttons = []
      , start, end
    if(this.isFirst()){
      start = 1
      end = (this.buttons_max <= this.pages) ? this.buttons_max : this.pages
    } else if(this.isLast()){
      start = this.pages - (this.buttons_max - 1)
      end = this.pages
      if(start < 1) start = 1
    } else {
      start = this.page - Math.floor(this.buttons_max / 2)
      end = this.page + Math.floor(this.buttons_max / 2)
      if(start < 1){
        start = 1
        end++
      }
      if(end > this.pages){
        end = this.pages
        start = this.pages - (this.buttons_max - 1)
        if(start < 1) start = 1
      }
    }
    for(var i=start; i <= end; i++) buttons.push(i)
    return buttons
  }
  /**
   * Set the properties of the pagination
   * @param obj
   */
  pagination.prototype.set = function(obj){
    if("object" !== typeof obj) obj = {}
    if("undefined" !== typeof obj.start) this.start = parseInt(obj.start,10)
    if("undefined" !== typeof obj.limit) this.limit = parseInt(obj.limit,10)
    if("undefined" !== typeof obj.total) this.total = parseInt(obj.total,10)
    this.process()
  }
  return pagination
})

paginationModule.filter("paginationStart", function(){
  return function(input, start){
    start = parseInt(start,10)
    return input.slice(+start)
  }
})

paginationModule.filter("paginationRange", function(){
  return function(input, total){
    total = parseInt(total,10)
    for(var i = 1; i <= total; i++) input.push(i)
    return input
  }
})
