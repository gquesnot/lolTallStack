<?php

namespace App\Http\Controllers;

use App\Models\Champion;
use App\Models\Item;
use App\Traits\LolInit;
use DOMDocument;
use HtmlParser\Parser;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Http;
use PHPHtmlParser\Dom;
use PHPHtmlParser\Dom\Node\HtmlNode;
use PHPHtmlParser\DTO\Tag\AttributeDTO;
use SimpleXMLElement;
use function PHPUnit\Framework\stringContains;


class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests, LolInit;


    private array $wikStatsMapping = [
        " ability haste" => "ah",
        " ability power" => "ap",
        "% bonus movement speed" => "msPercent",
        "% magic penetration" => "magicPenPercent",
        "% armor penetration" => "armorPenPercent",
        "% bonus attack speed" => "asPercent",
        "% omnivamp" => "omnivamp",
        " armor" => "armor",
        " lethality" => "lethality",
        " magic penetration" => "magicPen",
        " magic resistance" => "mr",
        " bonus movement speed" => "ms",
        " bonus health" => "hp",
        " tenacity" => "tenacity",
        " slow resistance" => "slowResistance",
        " bonus attack damage" => "ad",

    ];


    public function loadItems()
    {
        set_time_limit(120);
        $this->initLol();
        $items = $this->api->getStaticItems()->getData()['data'];

        foreach ($items as $itemId => $item) {
            $dbItem = Item::find($itemId);

            if (!$dbItem) {
                $dbItem = new Item;
                $dbItem->id = $itemId;
            }

            $dbItem->name = $item['name'];
            $dbItem->description = $item['description'];
            $dbItem->colloq = $item['colloq'];
            $dbItem->tags = implode(";", $item['tags']);
            $dbItem->gold = $item['gold']['total'];
            $dbItem->stats = $item['stats'];
            if (count($dbItem->stats) > 0) {
                $statsDescription = $this->parseXmlDescription($dbItem->description);
                if ($dbItem->id === 4645) {
                    $statsDescription['MagicPenetration'] = 15;
                }
                $dbItem->stats_description = $statsDescription;
            }

            $dbItem->img = $item['image']['full'];//http://ddragon.leagueoflegends.com/cdn/12.1.1/img/item/${image}
            $dbItem->save();


        }
    }

    public function parseXmlDescription($description)
    {
        $stats = [];
        $description = $this->parseHtmlTag($description, 'mainText');
        $description = $this->parseHtmlTag($description, 'stats');
        if ($description === "") {
            return $stats;
        }
        $statsStr = explode('<br>', $description);

        foreach ($statsStr as $stat) {
            $value = $this->parseHtmlTag($stat, 'attention');
            if (str_contains($value, '%')) {
                $value = str_replace('%', '', $value);
                $value = (float)$value / 100;
            } else {
                $value = (int)$value;
            }
            $stats[str_replace(' ', '', explode('</attention>', $stat)[1])] = $value;
        }
        return $stats;
    }

    public function parseHtmlTag($text, $htmlTag)
    {
        $originalText = $text;
        $text = explode("</${htmlTag}>", $text)[0];
        $text = explode("<${htmlTag}>", $text);
        if (count($text) !== 2) {
            dd($text, $originalText);
        }
        return $text[1];
    }

    public function getSummoner(string $summonerName)
    {
        $this->initLol();
        $summoner = $this->api->getSummonerByName($summonerName)->getData();
        $matchList = $this->api->getMatchIdsByPUUID($summoner['puuid']);
        return response()->json(['matchIds' => $matchList]);

    }

    public function getSummonerMatch(string $summonerName, string $matchId)
    {
        $this->initLol();
        $version = $this->api->getStaticVersions()[0];
        $this->loadChampions();

        $match = $this->api->getMatch($matchId)->getData()['info'];


        $matchTimeline = $matchTimeline = json_decode($this->getMatchTimeline($matchId), true)['info'];
        $maxFrame = count($matchTimeline['frames']) - 1;
        $summoners = $match['participants'];
        foreach ($summoners as $idx => $summoner) {
            $items = [];
            for ($i = 0; $i <= 5; $i++) {
                $item = $summoner['item' . $i];
                if ($item != 0) {
                    $items[] = $item;
                }

            }
            $summoners[$idx]['champion'] = Champion::find($summoner['championId']);
            $summoners[$idx]['items'] = $items;

        }
        return response()->json(["match" => $match, 'matchTimeline' => $matchTimeline, 'maxFrame' => $maxFrame, 'summoners' => $summoners]);

    }

    // parse xml description

    public function loadChampions()
    {
        $champions = $this->api->getStaticChampions()->getData()['data'];

        foreach ($champions as $championName => $champion) {
            $championId = $champion['key'];
            $dbChampion = Champion::where('id', $championId)->first();
            if ($dbChampion == null) {

                $dbChampion = new Champion();
                $dbChampion->id = $championId;
                $dbChampion->name = $championName;
            }
            $dbChampion->stats = $champion['stats'];
            $dbChampion->img = $champion['image']['full'];//http://ddragon.leagueoflegends.com/cdn/12.1.1/img/item/${image}
            $dbChampion->save();

        }
    }


    // scrap mythic items and legendary items from lol wiki and save them to database using guzzle
    public function scrapLolFandom()
    {
        $this->getStatsOfMythicItems();
        return ;
        $legendary = Http::get('https://leagueoflegends.fandom.com/wiki/Template:Items/List')->body();
        $dom = new Dom;
        $dom->loadStr((string)$legendary);
        $root = $dom->find('#items #grid #item-grid #grid #item-grid')[0];
        $categoryNames = $root->find('dt');
        $allItems = $root->find('.tlist');
        $itemsCateogry = [];
        for ($i = 0; $i < count($categoryNames); $i++) {

            $categoryName = $categoryNames[$i]->text();
            $itemsList = $allItems[$i]->find('.item-icon');
            $itemsName = [];
            foreach ($itemsList as $item) {
                //value to utf8

                $itemsName[] = htmlspecialchars_decode($item->getTag()->getAttribute('data-item')->getValue(), ENT_QUOTES);
            }
            $itemsCateogry[$categoryName] = $itemsName;
        }
        foreach ($itemsCateogry as $categoryName => $category) {
            $categoryName = mb_strtolower(str_replace(' ', '_', trim(str_replace('items', '', $categoryName))));
            if (str_contains($categoryName, 'ornn')) {
                $categoryName = 'mythic';
            }
            foreach ($category as $itemName) {
                //fix mapping
                // gold from pyke
                if ($itemName == "'Your Cut'") {
                    $itemName = 'Your Cut';
                } //magic boots
                else if ($itemName == "Slightly Magical Boots") {
                    $itemName = 'Slightly Magical Footwear';
                }
                $items = Item::where('name', $itemName)->get();
                if (count($items) == 0) {
                    $items = Item::where('name', 'LIKE', "%$itemName%")->get();
                }
                if (count($items)) {
                    foreach ($items as $item) {
                        $item->type = mb_strtolower($categoryName);
                        $item->save();
                    }
                }
            }
        }
    }

    public function getStatsOfMythicItems()
    {
        $items = Item::where('type', 'mythic')->get();
        $res = [];
        foreach ($items as $item) {

            $url = "https://leagueoflegends.fandom.com/api.php?format=json&action=parse&disablelimitreport=true&prop=text&title=List_of_items&text={{Tooltip/Item|item=$item->name|enchantment=|variant=|game=lol}}";
            $datas = Http::get($url)->json()['parse']['text']['*'];
            $mythicStats = $this->findMythicStatsInHtml($item, $datas);
            $stats = $item->stats_description;
            $stats['Mythic'] = $mythicStats;
            $item->stats_description = $stats;
            $item->save();

        }
    }

    public function findMythicStatsInHtml($item, $datas)
    {
        $dom = new Dom;
        $dom->loadStr((string)$datas);
        $rows = $dom->find('table tr');
        foreach ($rows as $row) {
            if ($row->getChildren()[0]->text() == "Mythic:") {
                $res = [];
                $stats = str_replace("Empowers each of your other Legendary items with ", "", $row->getChildren()[1]->innerText());
                //fix frozen gauntlet
                $stats = str_replace("6% increased size", "", $stats);
                $stats = str_replace("and ", "", $stats);
                $stats = str_replace('.', "", $stats);
                $stats = explode(',', $stats);


                foreach ($stats as $stat) {
                    $keyVal = $this->mapWikiKeys($stat);
                    if ($keyVal != null) {
                        $key = $keyVal['key'];
                        $value = intval(str_replace($keyVal['str'], "", $stat));
                        $res[$key] = str_contains($keyVal['str'], '%') ? $value / 100 : $value;

                    }
                }
            }
        }
        return $res;
    }

    public function mapWikiKeys($stat)
    {
        foreach ($this->wikStatsMapping as $key => $value) {
            if (str_contains($stat, $key)) {
                return ['str' => $key, 'key' => $value];
            }
        }
        return null;

    }

    public function allItems()
    {
        $this->initLol();
        $version = $this->api->getStaticVersions()[0];
        $items = Item::all()->filter(function ($item) {
            return !str_contains($item->tags, 'Consumable') && !str_contains($item->tags, 'Jungle') && !str_contains($item->tags, 'Trinket') && $item->tags !== "" && $item->tags !== "Active";
        });
        $newItemList = [];
        foreach ($items as $id => $item) {


            $newItemList[$item->id] = $item;


        }
        return response()->json(['items' => $newItemList, 'version' => $version]);
    }


}
