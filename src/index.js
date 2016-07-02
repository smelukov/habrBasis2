let Value = require('basis.data').Value;
let Expression = require('basis.data.value').Expression;
let Dataset = require('basis.data').Dataset;
let DataObject = require('basis.data').Object;
let STATE = require('basis.data').STATE;
let wrap = require('basis.data').wrap;
let Node = require('basis.ui').Node;
let action = require('basis.net.action');

let cities = new Dataset({
  syncAction: action.create({
    url: '/api/cities',
    success(response) { this.set(wrap(response, true)) }
  }),
  save: action.create({
    url: '/api/cities',
    method: 'post',
    contentType: 'application/json',
    encoding: 'utf8',
    body() {
      return {
        items: this.getValues('data')
      };
    }
  })
});

new Node({
  container: document.querySelector('.container'),

  active: true,
  dataSource: cities,
  disabled: Value.query('childNodesState').as(state => state != STATE.READY),

  template: resource('./template/list.tmpl'),
  binding: {
    loading: Value.query('childNodesState').as(state => state == STATE.PROCESSING),
    empty: node => new Expression(
      Value.query(node, 'childNodesState'),
      Value.query(node, 'dataSource.itemCount'),
      (state, itemCount) => !itemCount && (state == STATE.READY || state == STATE.ERROR)
    )
  },
  action: {
    add() { cities.add(new DataObject()) },
    save() { cities.save() }
  },

  childClass: {
    template: resource('./template/item.tmpl'),
    binding: {
      name: 'data:'
    },
    action: {
      input(e) { this.update({ name: e.sender.value }) },
      onDelete() { this.delegate.destroy() }
    }
  }
});
