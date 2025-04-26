import puppeteer from 'puppeteer'
import {forumArticle} from '../DB/datatypes/forumArticle';

function hasTag(text:string, tags:string[]) {
  return tags.includes(text);
}

export async function scrapeForumArticles(link:string) {
  const browser = await puppeteer.launch( {headless: true ,args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:137.0) Gecko/20100101 Firefox/137.0'
  );

  await page.setExtraHTTPHeaders({
    'Accept-Language': 'de-DE,de;q=0.9'
  });

  await page.goto(link, {
    waitUntil: 'networkidle0'
  });

  const articles = await page.$$eval('div.atc_lt', divs =>
    divs.map(div => {
      const links = Array.from(div.querySelectorAll('a')).map(a => a.href);
      return {
        text: div.innerText.trim(),
        links
      };
    })
  );

  const smalltags = ['Benachrichtigung', 'Event'];
  const bigtags = [
    'Unbedingt lesen NEWS',
    'Benachrichtigung UPDATE NEWS',
    'Benachrichtigung SNEAK PEEK',
    'Event EVENTS AND SALES (Ongoing)',
    'Benachrichtigung NEWS',
    'Benachrichtigung GUIDES',
    'Benachrichtigung EVENTS AND SALES (Ongoing)'
  ];

  let result:forumArticle[] = [];

  articles.forEach(article => {
    const currentText = article.text.split('\n');

    if (hasTag(currentText[0], smalltags)) {
      result.push(new forumArticle(currentText[1], article.links[1], currentText[2]));
    } else if (hasTag(currentText[0], bigtags)) {
      result.push(new forumArticle(currentText[1], article.links[2], currentText[2]));
    } else {
      result.push(new forumArticle(currentText[0], article.links[0], currentText[1]));
    }
  });

  await browser.close();
  return result;
}