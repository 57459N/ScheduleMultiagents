import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import data from "../../src/previewData";
import "./GroupEditor.css";
import { useAppContext } from "../../src/AppContextProvider";

Modal.setAppElement("#root");

function GroupEditor() {
  const { groupsToLessons, setGroupsToLessons } = useAppContext();
  const [groups, setGroups] = useState(data.groups);
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [newSubgroup, setNewSubgroup] = useState(null);

  const flowMapping = {
    "РФ": 1,
    "ФЭ": 1,
    "АРИСТ": 1,
    "КБ": 2,
    "ПИ": 2,
  };

  const groupIdMapping = {
    "1 РФ": 1,
    "2 РФ": 2,
    "3 РФ": 3,
    "4 РФ": 4,
    "8 РФ": 5,
    "3 ФЭ": 6,
    "2 АРИСТ": 7,
    "8 АРИСТ": 8,
    "4 КБ": 9,
    "5 КБ": 10,
    "6 КБ": 11,
    "7 КБ": 12,
    "1 ПИ": 13,
    "5 ПИ": 14,
    "6 ПИ": 15,
    "7 ПИ": 16,
  };

  const updateGroupsToLessons = (groups) => {
    const result = [];

    const traverse = (group, parentName, fullPath) => {
      const { name, subgroups } = group;
      const currentPath = fullPath ? `${fullPath} - ${name}` : name;

      if (
        ["подгруппа 1", "подгруппа 2", "подгруппа 3"].includes(name) &&
        parentName in groupIdMapping
      ) {
        const speciality = parentName.match(/[А-Я]+/)?.[0];
        const number = parentName.match(/\d+/)?.[0];
        const subgroup = parseInt(name.replace("подгруппа ", ""), 10);

        if (speciality && number && subgroup) {
          result.push({
            group_id: groupIdMapping[parentName],
            flow: flowMapping[speciality],
            speciality,
            number,
            subgroup,
            name: currentPath,
          });
        }
      }

      subgroups.forEach((subgroup) => traverse(subgroup, name, currentPath));
    };

    groups.forEach((group) => traverse(group, "", ""));
    setGroupsToLessons(result);
  };

  useEffect(() => {
    updateGroupsToLessons(groups);
  }, [groups]);

  const toggleExpand = (id) => {
    setExpandedGroups((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }
      return newExpanded;
    });
  };

  const handleDeleteGroup = () => {
    const recursiveDelete = (groups, id) =>
      groups
        .filter((group) => group.id !== id)
        .map((group) => ({
          ...group,
          subgroups: recursiveDelete(group.subgroups, id),
        }));

    const updatedGroups = recursiveDelete(groups, selectedGroup.id);
    setGroups(updatedGroups);
    data.groups = updatedGroups;
    setSelectedGroup(null);
    setShowDeleteConfirmation(false);
  };

  const handleAddSubgroup = (group) => {
    setNewSubgroup({ parentId: group.id, name: "" });
    setExpandedGroups((prev) => new Set(prev).add(group.id));
  };

  const handleSaveSubgroup = () => {
    const addSubgroup = (groups, parentId, newSubgroup) =>
      groups.map((group) =>
        group.id === parentId
          ? {
              ...group,
              subgroups: [
                ...group.subgroups,
                { id: Date.now(), name: newSubgroup.name, subgroups: [] },
              ],
            }
          : { ...group, subgroups: addSubgroup(group.subgroups, parentId, newSubgroup) }
      );

    const updatedGroups = addSubgroup(groups, newSubgroup.parentId, newSubgroup);
    setGroups(updatedGroups);
    data.groups = updatedGroups;
    setNewSubgroup(null);
  };

  const renderGroups = (groups) =>
    groups.map((group) => (
      <div className="group-item" key={group.id}>
        <div
          className={`group-header ${selectedGroup?.id === group.id ? "selected" : ""}`}
          onClick={() => setSelectedGroup(group)}
        >
          <span onClick={() => toggleExpand(group.id)}>
            {group.subgroups.length > 0 && (expandedGroups.has(group.id) ? "▼" : "▶")}
          </span>
          {group.name}
        </div>

        {newSubgroup?.parentId === group.id && (
          <div className="add-subgroup">
            <input
              className="add-subgroup-input"
              type="text"
              value={newSubgroup.name}
              onChange={(e) =>
                setNewSubgroup((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Введите название подгруппы"
            />
            <div className="add-subgroup-buttons">
              <button
                className="add-subgroup-buttons__btn"
                onClick={handleSaveSubgroup}
              >
                ✔
              </button>
              <button
                className="add-subgroup-buttons__btn add-subgroup-buttons__btn_red"
                onClick={() => setNewSubgroup(null)}
              >
                ✘
              </button>
            </div>
          </div>
        )}

        {expandedGroups.has(group.id) && group.subgroups.length > 0 && (
          <div>{renderGroups(group.subgroups)}</div>
        )}
      </div>
    ));

  return (
      <div className="group-editor">
        <h2>Редактор списка групп</h2>
        <div className="group-editor-content">
          <div className="group-list">
            <h3>Список групп</h3>
            {renderGroups(groups)}
            <div className="group-list-buttons">
              <button
                className="group-list-buttons-btn"
                onClick={() =>
                  selectedGroup
                    ? handleAddSubgroup(selectedGroup)
                    : alert("Выберите группу для добавления подгруппы")
                }
              >
                Добавить
              </button>
              <button
                className="group-list-buttons-btn group-list-buttons-btn_red"
                onClick={() =>
                  selectedGroup
                    ? setShowDeleteConfirmation(true)
                    : alert("Выберите группу для удаления")
                }
              >
                Удалить
              </button>
            </div>
          </div>
        </div>

        <Modal
          isOpen={showDeleteConfirmation}
          onRequestClose={() => setShowDeleteConfirmation(false)}
          className="modal"
        >
          <h3>Подтверждение удаления</h3>
          <div className="modal-content">
            <p>
              Вы уверены, что хотите удалить группу "{selectedGroup?.name}"? Все её
              подгруппы также будут удалены.
            </p>
            <div className="actions">
              <button
                className="group-list-buttons-btn group-list-buttons-btn_red"
                onClick={handleDeleteGroup}
              >
                Удалить
              </button>
              <button
                className="group-list-buttons-btn"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Отмена
              </button>
            </div>
          </div>
        </Modal>
      </div>    
  );
}

export default GroupEditor;

