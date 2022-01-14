<?php

namespace App\Http\Livewire;


use App\Models\Item;
use App\Traits\LolInit;
use GuzzleHttp\Client;
use Illuminate\Support\Collection;
use Livewire\Component;
use RiotAPI\Base\Exceptions\GeneralException;
use RiotAPI\Base\Exceptions\RequestException;
use RiotAPI\Base\Exceptions\ServerException;
use RiotAPI\Base\Exceptions\ServerLimitException;
use RiotAPI\Base\Exceptions\SettingsException;
use RiotAPI\DataDragonAPI\DataDragonAPI;
use RiotAPI\LeagueAPI\LeagueAPI;
use RiotAPI\Base\Definitions\Region;
use RiotAPI\LeagueAPI\Objects\SummonerDto;

class Home extends Component
{

    use LolInit;
    public array $itemCategory = [
        [
            "name" => "All Items",
            "tags" => [],
        ],
        [
            "name" => "Attack Damage",
            "tags" => ["Damage"],
        ],
        [
            "name" => "Critical Strike",
            "tags" => ["CriticalStrike"],
        ],
        [
            "name" => "Attack Speed",
            "tags" => ["AttackSpeed"],
        ],
        [
            "name" => "On-Hit Effects",
            "tags" => ["OnHit"],
        ],
        [
            "name" => "Armor Penetration",
            "tags" => ["ArmorPenetration"],
        ],
        [
            "name" => "Ability Power",
            "tags" => ["SpellDamage"],
        ],
        [
            "name" => "Mana & Regeneration",
            "tags" => ["Mana", "ManaRegeneration"],
        ],
        [
            "name" => "Magic Penetration",
            "tags" => ["MagicPenetration"],
        ],
        [
            "name" => "Health & Regeneration",
            "tags" => ["Health", "HealthRegen"],
        ],
        [
            "name" => "Armor",
            "tags" => ["Armor"],
        ],
        [
            "name" => "Magic Resistance",
            "tags" => ["SpellBlock"],
        ],
        [
            "name" => "Ability Haste",
            "tags" => ["AbilityHaste"],
        ],
        [
            "name" => "Movement",
            "tags" => ["Boots"],
        ],
        [
            "name" => "Life Steal & Vamp",
            "tags" => ["LifeSteal", "SpellVamp"],
        ],
    ];



    public ?string $summonerName = "random iron";
    public string $version= '12.1.1';
    public $summoner;


    public array $matchList = [];
    public ?string $selectedMatch = null;
    public ?array $match = null;

    public ?string $participantId = null;
    public ?array $summoners;

    public ?array $matchTimeline;
    public ?int $selectedTime = 0;

    public ?Collection  $currentTimeline;
    public ?array $participantFrame;
    public ?array $enemyFrames;

    public ?Collection $items;

    public int $currentGold = 0;

    //SHOP

    public array $modItems;
    public array $myItemList;
    public int $selectedCategory = 0;


    public function mount()
    {
        $this->initLol();
        $this->version = $this->api->getStaticVersions()[0];
        $this->items = Item::all();
        if ($this->summonerName)
            $this->getMatchIds();
        //$this->getItems();
    }


    public function getMatchIds()
    {
        if ($this->summonerName) {

            try {
                $this->summoner = $this->api->getSummonerByName($this->summonerName)->getData();
                $this->matchList = $this->api->getMatchIdsByPUUID($this->summoner['puuid']);

                $this->selectedMatch = $this->matchList[0];
                $this->updatedSelectedMatch($this->selectedMatch);
            } catch (\Exception $e) {
                $this->matchList = [];

            }


        }

    }


    public function updatedSelectedMatch($value)
    {

        $this->initLol();
        $this->selectedTime = 0;
        $this->match = $this->api->getMatch($this->selectedMatch)->getData()['info'];

        $this->matchTimeline = json_decode($this->getMatchTimeline($this->selectedMatch), true)['info'];
        $this->summoners = $this->match['participants'];
        foreach ($this->summoners as $idx => $summoner) {
            $items = [];
            for($i = 0; $i <= 5;$i++){
                $item = $summoner['item'.$i];
                if ($item != 0)
                {
                    $items[] = $item;
                }

            }
            $this->summoners[$idx]['items'] = $items;
            if (strtolower($this->summonerName) === strtolower($summoner['summonerName'])){
                $this->summonerName =$summoner['summonerName'];
                $this->participantId = $idx;
                $this->myItemList = $items;
            }

        }

        $this->updateTimeline(true);

    }


    public function changeCurrentGold($newCurrentGold){
        $this->currentGold = $newCurrentGold;
    }

    public function updatedSummonerName($value)
    {

        $this->initLol();
        $this->getMatchIds();
    }

    public function getEnemyParticipantIds(){
        $myTeamId= $this->summoners[$this->participantId]['teamId'];
        $res = [];
        foreach($this->summoners as $idx => $summoner){
            if ($summoner['teamId'] != $myTeamId)

                $res[] = [
                'idx' => $idx,
                    'summonerName' => $summoner['summonerName'],
                    'championName' => $summoner['championName']
            ];
        }
        return $res;
}

    public function getEnemyFrames(){
            $enemyParticipantIds = $this->getEnemyParticipantIds();
            $this->enemyFrames  = [];
            foreach($enemyParticipantIds as $enemyParticipant){
                $tmp = $this->matchTimeline['frames'][$this->selectedTime]['participantFrames'][$enemyParticipant['idx'] + 1];
                $tmp['summonerName'] = $enemyParticipant['summonerName'];
                $tmp['championName'] = $enemyParticipant['championName'];
                $tmp['championStats']['physicalDamageReductionPercent'] = 100  / (100 +  $tmp['championStats']['armor']);
                $tmp['championStats']['magicalDamageReductionPercent'] =100  / (100 +  $tmp['championStats']['magicResist']);
                $tmp['championStats']['physicalDamageTaken'] = $this->participantFrame['championStats']['dps'] * $tmp['championStats']['physicalDamageReductionPercent'];
                //$tmp['championStats']['magicalDamageTakenPercent'] = 0;
                $this->enemyFrames[] = $tmp;
            }


    }

    public function updateTimeline($withGold=false){

        $this->participantFrame = $this->matchTimeline['frames'][$this->selectedTime]['participantFrames'][$this->participantId];
        $this->participantFrame['championStats']['dps'] = $this->participantFrame['championStats']['attackDamage'] * ($this->participantFrame['championStats']['attackSpeed']/100);
        $this->getEnemyFrames();
        $this->applyCategory();
        $this->calcCurrentGold();


    }



    //SHOP

    public function calcCurrentGold(){

        $gold = 0;
        foreach($this->myItemList as $itemId){
            foreach($this->items as $item){
                if ($item->id == $itemId)
                    $gold += $item->gold;
            }
        }

        $this->currentGold = $this->participantFrame['totalGold'] - $gold;
    }

    public function removeItem($id)
    {
        array_splice($this->myItemList, $id, 1);
        $this->calcCurrentGold();
        //dd($this->myItemList);
    }

    public function addItem($id)
    {
        if (count($this->myItemList) < 6){
            $this->myItemList[] = $id;
            $this->calcCurrentGold();
        }
    }

    public function selectCategory($categoryIdx)
    {
        $this->selectedCategory = $categoryIdx;
        $this->applyCategory();

    }
    public function isTagsInCategory($tags, $category){
        foreach($tags as $tag){
            if (in_array($tag, $category['tags']))
                return true;
        }
        return false;

    }

    public function applyCategory(){
        $this->modItems = [];

        foreach ($this->items as $item){
            $tagsSplit = explode(";", $item->tags);
            if ($this->isTagsInCategory($tagsSplit, $this->itemCategory[$this->selectedCategory]) || $this->selectedCategory == 0)
                $this->modItems[] = $item;
        }
    }

    public function resetItems(){
        $this->myItemList = $this->summoners[$this->participantId]['items'];
        $this->calcCurrentGold();
    }


    public function render()
    {
        return view('livewire.home');
    }
}
