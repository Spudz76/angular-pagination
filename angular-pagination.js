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
  pagination.prototype.pages = 1
  /**
   * Current page
   * @type {number}
   */
  pagination.prototype.page = 1
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
    this.range.start = this.total > 0 ? this.start + 1 : 0
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
    return (this.page === 1)
  }
  /**
   * Determine if this last page is current selected
   * @returns {boolean}
   */
  pagination.prototype.isLast = function(){
    return (this.page === this.pages)
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
    if(this.page <= 1)
      return 0
    else
      return this.start - this.limit
  }
  /**
   * Get the safe starting point of the next page
   * @returns {number}
   */
  pagination.prototype.next = function(){
    if(this.page === this.pages)
      return this.start
    else
      return this.start + this.limit
  }
  /**
   * Get the starting point of the last page
   * @returns {number}
   */
  pagination.prototype.last = function(){
    return Math.floor((this.pages - 1) * this.limit)
  }
  /**
   * Set the properties of the pagination
   * @param obj
   */
  pagination.prototype.set = function(obj){
    if("object" !== typeof obj) obj = {}
    if("undefined" !== typeof obj.limit) this.limit = parseInt(obj.limit,10)
    if("undefined" !== typeof obj.total) this.total = parseInt(obj.total,10)
    if("undefined" !== typeof obj.start) this.start = parseInt(obj.start,10)
    this.process()
  }
  return pagination
})

paginationModule.filter("startFrom", function(){
  return function(input, start){
    return input.slice(+start)
  }
})

paginationModule.filter("range", function(){
  return function(input, total){
    total = parseInt(total,10)
    for(var i = 0; i < total; i++) input.push(i)
    return input
  }
})
