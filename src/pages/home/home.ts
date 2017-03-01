import { Component } from '@angular/core';
import { NavController, LoadingController, ActionSheetController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { InAppBrowser } from 'ionic-native'
import { RedditService } from '../../providers/reddit-service';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	public feeds: Array<any>;
	public noFilter: Array<any>;
	public hasFilter: boolean = false;
	private url: string = "https://www.reddit.com/new.json";
	private olderPosts: string = "https://www.reddit.com/new.json?after=";
	private newerPosts: string = "https://www.reddit.com/new.json?before=";

	constructor(public redditService: RedditService, public navCtrl: NavController,
		public http: Http, public loadingCtrl: LoadingController, public actionSheetCtrl: ActionSheetController) {
		this.fetchContent();
	}

	showFilters(): void {
		let actionSheet = this.actionSheetCtrl.create({
			title: 'Opções do filtro:',
			buttons: [
				{
					text: 'Música',
					handler: () => {
						this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === 'music');
						this.hasFilter = true;
					}
				},
				{
					text: 'Filmes',
					handler: () => {
						this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === 'movies');
						this.hasFilter = true;
					}
				},
				{
					text: 'Games',
					handler: () => {
						this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === "gaming");
						this.hasFilter = true;
					}
				},
				{
					text: 'Imagens',
					handler: () => {
						this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === "pics");
						this.hasFilter = true;
					}
				},
				{
					text: 'Ask Reddit',
					handler: () => {
						this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === "askreddit");
						this.hasFilter = true;
					}
				},
				{
					text: 'Cancelar',
					role: 'cancel',
					handler: () => {
						this.feeds = this.noFilter;
						this.hasFilter = false;
					}
				}
			]
		});
		actionSheet.present();
	}

	doRefresh(refresher) {
		let paramsUrl = (this.feeds.length > 0) ? this.feeds[0].data.name : "";

		this.redditService.fetchData(this.newerPosts + paramsUrl).then(data => {
			this.feeds = data;
			refresher.complete();
			this.noFilter = this.feeds;
			this.hasFilter = false;
		})
	}

	doInfinite(infiniteScroll) {
		let paramsUrl = (this.feeds.length > 0) ? this.feeds[this.feeds.length - 1].data.name : "";

		this.redditService.fetchData(this.olderPosts + paramsUrl).then(data => {
			this.feeds = data;
			infiniteScroll.complete();
			this.noFilter = this.feeds;
			this.hasFilter = false;
		})
	}

	itemSelected(url: string): void {
		new InAppBrowser(url, '_system');
	}

	fetchContent(): void {
		let loading = this.loadingCtrl.create({
			content: 'carregando conteúdo'
		});

		loading.present();

		this.redditService.fetchData(this.url).then(data => {
			this.feeds = data;
			this.noFilter = this.feeds;
			this.hasFilter = false;
			loading.dismiss();
		})
	}

}
