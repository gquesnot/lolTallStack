<div class="grid grid-cols-2">

    <div>
        Current Gold (total with items):
    </div>
    <div>
        {{$currentGold}}
    </div>
    <div>
        AD:
    </div>
    <div>
        {{$participantFrame['championStats']['attackDamage']}}
    </div>
    <div>
        AS:
    </div>
    <div>
        {{($participantFrame['championStats']['attackSpeed'] / 100)}}
    </div>
    <div>
        CRIT:
    </div>
    <div>
        ??
    </div>
    <div>
        ARMOR PEN:
    </div>
    <div>
        {{$participantFrame['championStats']['armorPen']}} + {{$participantFrame['championStats']['armorPenPercent']}}% +? {{$participantFrame['championStats']['bonusArmorPenPercent']}}%
    </div>
    <div>
        AP:
    </div>
    <div>
        {{$participantFrame['championStats']['abilityPower']}}
    </div>
    <div>
        MAGIC PEN:
    </div>
    <div>
        {{$participantFrame['championStats']['magicPen']}} + {{$participantFrame['championStats']['magicPenPercent']}}% +? {{$participantFrame['championStats']['bonusMagicPenPercent']}}%
    </div>
    <div>
        HP:
    </div>
    <div>
        {{$participantFrame['championStats']['healthMax']}}
    </div>
    <div>
        ARMOR:
    </div>
    <div>
        {{$participantFrame['championStats']['armor']}}
    </div>
    <div>
        MAGIC RESIST:
    </div>
    <div>
        {{$participantFrame['championStats']['magicResist']}}
    </div>
    <div>
        DPS:
    </div>
    <div>
        {{round($participantFrame['championStats']['dps'],2)}}
    </div>



</div>
