from icrawler.builtin import GoogleImageCrawler, BingImageCrawler

positive_image_types = ['slovakia car plates','slovakia car plate', 'evidenčné číslo']
p_max_n = 1000

negaive_image_types = ['roads','Human faces', 'trees']
n_max_n = 1000

for i in positive_image_types:
    bing_crawler = BingImageCrawler(storage={'root_dir':f'p/'})
    bing_crawler.crawl(keyword=i, filters=None, max_num = p_max_n, offset=0)

for i in negaive_image_types:
    bing_crawler = BingImageCrawler(storage={'root_dir':f'n/'})
    bing_crawler.crawl(keyword=i, filters=None, max_num = n_max_n, offset=0)