Vue.component('v-select', VueSelect.VueSelect);

new Vue({
	el: '#app',
	data: {
		pokemons: [],
		selected: {},
		scalars: null,
		candies: null,
		dusts: null,
		bonus_atk: 15,
		bonus_def: 15,
		bonus_sta: 15,
		level: 20,
	},
	created: function() {
		/* Stats */
		this.$http.get('stats.json').then(response => {
	    	this.pokemons = response.body;
	    	this.selected = this.pokemons[149];
	  	}, response => {
	    	alert('Stats Error!');
	  	});

		/* Scalar */
		this.$http.get('scalar.json').then(response => {
	    	this.scalars = response.body;	    	
	  	}, response => {
	    	alert('Scalar Error!');
	  	});

		/* Candy */
		this.$http.get('scandy.json').then(response => {
	    	this.candies = response.body;
	  	}, response => {
	    	alert('Candy Error!');
	  	});

		/* Dust */
		this.$http.get('sdust.json').then(response => {
	    	this.dusts = response.body;
	  	}, response => {
	    	alert('Dust Error!');
	  	});
	},
	computed: {
		base_atk: function() {
			if ( this.selected ) {
				var stats = this.selected;
				return Number( stats.atk );
			}

			return 0;
		},
		base_def: function() {
			if ( this.selected ) {
				var stats = this.selected;
				return Number( stats.def );
			}

			return 0;
		},
		base_sta: function() {
			if ( this.selected ) {
				var stats = this.selected;
				return Number( stats.sta );
			}

			return 0;
		},
		iv_percent: function() {
			var percent = ( Number(this.bonus_atk) + Number(this.bonus_def) + Number(this.bonus_sta) ) * 100 / 45;
			return Math.round( percent * 100 ) / 100;
		},
		cp_scalar: function() {
			if ( this.level && this.scalars ) {
				var level = this.level;
				var scalars = this.scalars;

				if ( level > 40 || level < 1 ) return 0;
		        if ( level % 1 ) return Math.pow( ( Math.pow( scalars[ level-0.5 ], 2) + Math.pow( scalars[ level-1.5 ], 2) ) / 2, 0.5);
		        return scalars[ level-1];
			}

			return 0;
		},
		result_cp: function() {
			if ( this.cp_scalar ) {
				var atk = this.base_atk + Number(this.bonus_atk);
				var def = Math.sqrt( this.base_def + Number(this.bonus_def) );
				var sta = Math.sqrt( this.base_sta + Number(this.bonus_sta) );
				var oth = Math.pow( this.cp_scalar, 2) * 0.1;

				return Math.floor( atk * def * sta * oth );
			}

			return 0;
		},
		result_hp: function() {
			if ( this.cp_scalar ) {
				return Math.floor( ( this.base_sta + Number(this.bonus_sta) ) * this.cp_scalar );
			}

			return 0;
		},
		dust: function() {
			if ( this.level && this.dusts ) {
				var level = this.level;
				var dusts = this.dusts;

				if ( level > 40 || level < 1 ) return 0;
				if ( level % 1 ) return dusts[ level - 1.5 ];
				return dusts[ level - 1 ];
			}

			return 0;
		},
		candy: function() {
			if ( this.level && this.candies ) {
				var level = this.level;
				var candies = this.candies;

				if ( level > 40 || level < 1 ) return 0;
				if ( level % 1 ) return candies[ level - 1.5 ];
				return candies[ level - 1 ];
			}

			return 0;
		}
	},
	methods: {
		bonus_change: function( type, value ) {
			new_bonus = this[type] + value;

			if( new_bonus >= 0 && new_bonus <= 15 ) {
				this[type] = new_bonus;
			}
		},
		level_change: function( value ) {
			new_level = Number( this.level ) + value;

			if( new_level >= 1 && new_level <= 40 ) {
				this.level = new_level;
			}
		}
	}
});